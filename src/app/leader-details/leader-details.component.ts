import {
  Component,
  OnInit,
  AfterViewChecked,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone, 
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ContactService } from "../service/contact.service";
import { AccountsMapService } from "../service/accounts-map.service";
import { EmailClass } from "../client-details/email-class";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatDialog } from "@angular/material";
import { Alert } from "selenium-webdriver";
import { AlertBoxComponent } from "../alert-box/alert-box.component";
import { Contact } from "../contact-grid/contact";
import { EventClass } from "../contact-details/event-class";
import { LeadService } from "../service/lead.service";
import { MessageService } from "../message.service";
import { AdminServiceService } from "../service/admin-service.service";
import { MapsAPILoader } from "@agm/core";
import {OppurtunityService} from '../service/opportunity.service';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { FormService } from "../service/form.service";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { FileService } from "../file.service";
declare var google;

@Component({
  selector: "app-leader-details",
  templateUrl: "./leader-details.component.html",
  styleUrls: ["./leader-details.component.css"],
})
export class LeaderDetailsComponent implements OnInit {
  //editor
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "300px",
    minHeight: "0",
    maxHeight: "auto",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter text here...",
  };
  //editor
  popUpMsg: any = "";
  id: number;
  clientData: any;
  clientDetails: any;
  accType: any;
  accParent: any;
  rating: any;
  industries: any;
  public todayDate: any = new Date();
  status: any;
  opportunities: any = [];
  contact: any = [];
  rContact: any = [];
  logContact: any;
  countryList: any[];
  stateList: any[];
  cityList: any[];
  loginUser: any;
  convert = new ConvertLead();

  ccBlock: boolean = false;
  bccBlock: boolean = false;
  ccBlockShow() {
    this.ccBlock = true;
  }
  bccBlockShow() {
    this.bccBlock = true;
  }

  public options: Object = {
    placeholderText: "Enter Text",
    charCounterCount: false,
  };
  emailTemplate: any;
  call: any = {
    subject: undefined,
    due_date: undefined,
    contact_id: undefined,
    taskable_type: "App\\Lead",
    taskable_id: undefined,
    status: "completed",
  };

  task: any = {
    assigned_user_id: undefined,

    subject: undefined,
    due_date: undefined,
    contact_id: undefined,
    taskable_type: "App\\Lead",
    taskable_id: undefined,
    status: "open",
  };
  event: EventClass = new EventClass();

  EditAccPop: boolean = false;
  openEditContactPop() {
    this.EditAccPop = true;
    this.searchControl = new FormControl();
    setTimeout(() => {
      this.loadAddressAutocomplete();
    }, 500);
    setTimeout(() => {
      $("#street_add").val(this.fulladdr);
    }, 1000);
  }
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
  loadAddressAutocomplete() {
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ["address"],
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.country_name = "";
        this.state_name = "";
        this.city = "";
        this.zip_code = "";
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
            var street_address = "";
            var street_number = "";
            var street_route = "";
            for (var i = 0; i < place.address_components.length; i++) {
              if (place.address_components[i].types[0] == "street_number") {
                street_number = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[0] == "route") {
                street_route = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[0] == "country") {
                that.country_name = place.address_components[i].long_name;
                that.country_code = place.address_components[i].short_name;
              }
              if (
                place.address_components[i].types[0] ==
                "administrative_area_level_1"
              ) {
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
          var street_add = street_number ? street_number + " " : "";
          street_address = street_add + street_route;
          this.newContact.country = this.country_name;
          this.newContact.state = this.state_name;
          this.newContact.city = this.city;
          this.newContact.zip = this.zip_code;
          this.newContact.street = street_address;
        });
      });
    });
  }
  //newCon

  newContact: any;
  assignedUserList: any[] = [];
  myControl: FormControl = new FormControl();
  myControl2: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  assignedUserOptions: Observable<string[]>;
  date = new FormControl(new Date().toLocaleDateString());
  EvtstartDate = new FormControl(new Date().toLocaleDateString());
  EvtEndDate = new FormControl(new Date().toLocaleDateString());
  mail: EmailClass = new EmailClass();
  reportToLst: any = [];
  accountList: any = [];
  salutations = [{ name: "Mr" }, { name: "Mrs" }];
  @ViewChild("search")
  public searchElementRef: ElementRef;
  public searchControl: FormControl;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public fulladdr: string;
  public country_code: string;
  public state_name: string;
  public city = "";
  public zip_code: string;
  public country_name: string;

  constructor(
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private ContactServiceService: LeadService,
    private acMap: AccountsMapService,
    private msg: MessageService,
    public dialog: MatDialog,
    private admService: AdminServiceService,
    private oppoService: OppurtunityService,
    private formService: FormService,
    private fileService: FileService
  ) {
    if (
      location.hostname.search("192.168") >= 0 ||
      location.hostname.search("localh") >= 0 ||
      location.hostname.search("tnt1") >= 0 ||  location.hostname.search("adrenotravel")>=0
      ||  location.hostname.search("prashtest.")>=0
    ) {
      this.isStandard = true;
    }
    this.msg.sendMessage("lead");
    this.ContactServiceService.reportsToList().subscribe((data: any) => {
      this.reportToLst = data.leads;
    });
    this.renderData();

    this.getAllUser();
    this.isSetupMail = localStorage.getItem("setup_mail");

    if (this.isStandard) {
      this.ContactServiceService.getStandardFileds().subscribe((data: any) => {
        console.log(data);
        this.standardFields = data.standard_fields;
      });
    }

    setTimeout(() => {
      this.load_form_data();
    }, 1400);
    // this.getSalutations();
  }

  getSalutations() {
    this.admService.getSalutations().subscribe((data: any) => {
      this.salutations = data.salutations;
    });
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: "250px",
      data: JSON.stringify(this.popUpMsg),
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      // this.animal = result;
    });
  }

all_fileds_val=[];
no_email_temp_modules=['[Account.','[Contact.','[Opportunity','[Supplier.','[PersonalAccount.'];
 

watsapp:any={'recipient_no':'','recipient':'','message':'','whatsapp_type':'','whatsapp_id':''};
 
isWhatsappEnabled=false;
whatsapp_thread_exist=false;  
  renderData() {
  this.email_templates_err='';
    $("body").removeClass("modal-open");
    $(".modal-backdrop").remove();

    this.ContactServiceService.getCountryList().subscribe((data: any) => {
      this.countryList = data.countries;
    });

    if (this.accParent == undefined) {
      this.ContactServiceService.setUpAccountsMap().subscribe((data: any) => {
        this.acMap.setUpMaps(data);
        this.accParent = this.acMap.accParentMapData;
        this.accType = this.acMap.accTypeMapData;
        this.rating = this.acMap.ratingsMapData;
        this.industries = this.acMap.industriesMapData;
        this.status = data.lead_statuses;
        this.salutations = data.salutations;
      });
    } else {
      this.accParent = this.acMap.accParentMapData;
      this.accType = this.acMap.accTypeMapData;
      this.rating = this.acMap.ratingsMapData;
      this.industries = this.acMap.industriesMapData;
    }
    this.id = this.route.snapshot.queryParams["id"];
    this.ContactServiceService.getClientDetails(this.id).subscribe(
      (data: any) => {
        this.clientData = data;
        this.contact = this.clientData.lead;

        this.clientDetails = this.clientData.lead;
      if(this.clientDetails.tenant_whatsapp_exist){
        this.isWhatsappEnabled=true;
        this.watsapp.recipient_no=this.clientDetails.whatsapp_no;
        this.watsapp.whatsapp_id = this.clientDetails.id;
        this.watsapp.whatsapp_type = "App\\Lead"; 
        this.whatsapp_thread_exist=this.clientDetails.whatsapp_thread_exist
      }
        this.documentData=this.clientDetails.documents;  
        this.module_attachment=[]; 
        if(this.documentData && this.documentData.length>0){
              for(let doc of this.documentData){
                this.module_attachment.push(doc.title); 
              }
        }
        this.mail.to_address = this.clientDetails.email;
        let temp = JSON.stringify(data.lead);
        this.newContact = JSON.parse(temp);
        let acc_id = data.lead.account_id;
        console.log(JSON.stringify(acc_id));

        this.newContact.account_id = acc_id;
        this.newContact.id = this.id;
        this.opportunities = this.clientData.related_opportunities;
        this.assignedUserList = this.clientData.users;
        this.loginUser = this.clientData.auth_user;
        this.fulladdr = this.newContact.street;
        this.ContactServiceService.fetchDetailsForCovertion(this.id).subscribe(
          (data: any) => {
            this.convert.account_name = data.lead.company;
            this.convert.contact_first_name = data.lead.first_name;
            this.convert.contact_last_name = data.lead.last_name;
            this.convert.salutation = data.lead.salutation;
            this.accountList = data.accounts;
          }
        );

      this.all_fileds_val=[];
      for (var key in this.clientDetails) {
          if (this.clientDetails.hasOwnProperty(key)) {
            var val = this.clientDetails[key]; 
            this.all_fileds_val['Lead.'+key]=val; 
          }
      }
        this.get_additional_fields();
      }
    );
    // this.openDialog();
  }
  set_draft() {
    localStorage.setItem("lead_email_desc", this.mail.description_html);
    localStorage.setItem("lead_email_subject", this.mail.subject);
    localStorage.setItem("lead_email_to", this.mail.to_address);
    localStorage.setItem("lead_email_template", this.emailTemplate);
    console.log(localStorage.getItem("lead_email_desc"));
  }
  ngOnInit() {
    this.mail.description_html =
      localStorage.getItem("lead_email_desc") === null
        ? ""
        : localStorage.getItem("lead_email_desc");
    this.mail.subject =
      localStorage.getItem("lead_email_subject") === null
        ? ""
        : localStorage.getItem("lead_email_subject");
    this.emailTemplate = localStorage.getItem("lead_email_template");
    // this.mail.to_address = localStorage.getItem('lead_email_to')=== null?'':localStorage.getItem('lead_email_to');
    this.assignedUserOptions = this.myControl2.valueChanges.pipe(
      startWith(""),
      map((val) => this.filterAssisnedUser(val))
    );
    setTimeout(function () {
      $(".angular-editor .angular-editor-wrapper .angular-editor-textarea").css(
        "height",
        "300px"
      );
      console.log(
        $(
          ".angular-editor .angular-editor-wrapper .angular-editor-textarea"
        ).css("height")
      );
    }, 2500);
    this.loadPermissionSet();
  }
  view_lead = false;
  create_lead = false;
  download_lead = false;
  edit_lead = false;
  delete_lead = false;
  upload_lead = false;

  loadPermissionSet() {
    if (localStorage.getItem("permissionArray") != null) {
      var permissionArray = JSON.parse(localStorage.getItem("permissionArray"));
      if (permissionArray.Lead) {
        console.log(permissionArray.Lead);
        permissionArray.Lead.forEach((permissions) => {
          if (permissions.name == "view_lead") {
            this.view_lead = true;
          }
          if (permissions.name == "create_lead") {
            this.create_lead = true;
          }
          if (permissions.name == "edit_lead") {
            this.edit_lead = true;
          }
          if (permissions.name == "delete_lead") {
            this.delete_lead = true;
          }
          if (permissions.name == "upload_lead") {
            this.upload_lead = true;
          }
          if (permissions.name == "download_lead") {
            this.download_lead = true;
          }
        });
      }
    }
    if (localStorage.getItem("modulesArray") != null) {
      var modulesArray = JSON.parse(localStorage.getItem("modulesArray"));
      console.log(modulesArray);
      modulesArray.forEach((module) => {
        if (module.email_template == true) {
          this.show_email_temp = true;
        }
      });
    }
    if (this.view_lead == false) {
      //alert('You are not Authorized to view this page!';);
      this.popUpMsg = "You are not Authorized to view this page!";
      this.openDialog();
      this.router.navigate([
        "/maindashboard",
        { outlets: { bodySection: ["Dashboard"] } },
      ]);
    }
  }
  show_email_temp = false;
  filterAssisnedUser(val: string): any[] {
    if (val == undefined) {
      val = "";
    }
    return this.assignedUserList.filter((s) => new RegExp(val, 'gi').test(s.name));
    // return this.assignedUserList.filter((option) => {
    //   for (let a of option.name) {
    //     if (a.toLowerCase().includes(val.toLowerCase())) {
    //       return true;
    //     }
    //   }
    // });
  }
  all_attachment: any = [];
  all_attachment_urls: any = [];
  attachFiles(files: FileList) {
    const file = files[0];
    let form = new FormData();
    form.set("email_image", file);
    let that1 = this;
    this.fileService.uploadFileTos3(form).subscribe(
      (data: any) => {
        if (data.image_url) {
          this.all_attachment.push(data.name);
          this.all_attachment_urls.push(data.image_url);
          this.mail.documents = this.all_attachment_urls;
        }
        console.log(this.all_attachment);
        console.log(this.mail);
      },
      (error) => {
        this.popUpMsg = JSON.stringify("File unable to upload!");
        this.openDialog();
      }
    );
  }
  removeAttachment(index) {
    this.all_attachment.splice(index, 1);
    this.all_attachment_urls.splice(index, 1);
    this.mail.documents = this.all_attachment_urls;
  }
  isSetupMail: any = 0;
  sendEmail() {
    this.isSetupMail = localStorage.getItem("setup_mail");
    if (this.isSetupMail == 0) {
      $("#email_set").trigger("click");
      return false;
    }
    if (this.mail.to_address == undefined || this.mail.to_address == "") {
      this.popUpMsg = "Please fill receiver email address!";
      this.openDialog();
      return false;
    }
    if (this.mail.subject == undefined || this.mail.subject == "") {
      this.popUpMsg = "Please add subject!";
      this.openDialog();
      return false;
    }
    if (
      this.mail.description_html == undefined ||
      this.mail.description_html == ""
    ) {
      this.popUpMsg = "The email body field is mandatory!";
      this.openDialog();
      return false;
    }
    this.mail.from_address = this.clientData.auth_user.email;
    this.mail.emailable_id = this.clientDetails.id + "";
    this.mail.emailable_type = "App\\Lead";
    this.mail.description_html = this.mail.description_html.replace(
      /&#(\d+);/g,
      function (match, number) {
        return String.fromCharCode(number);
      }
    );

    this.ContactServiceService.sendMail(this.mail).subscribe((data: any) => {
      //  this.popUpMsg=JSON.stringify(data.message);
      this.popUpMsg = data.message;
      this.mail = new EmailClass();
      this.emailTemplate = undefined;
      this.openDialog();
      this.renderData();
      this.all_attachment = [];
      this.all_attachment_urls = [];
      this.mail.documents = [];
    });
  }
  logCall() {
    this.call.taskable_id = this.clientDetails.id;
    this.ContactServiceService.callLog(this.call).subscribe((data) => {
      this.renderData();
      this.call = {
        subject: undefined,
        due_date: undefined,
        contact_id: undefined,
        taskable_type: "App\\Account",
        taskable_id: undefined,
        status: "completed",
      };
      this.popUpMsg = data;
      this.openDialog();
    });
  }
  due_error = false;
  createTask() {
    this.task.taskable_id = this.clientDetails.id;
    // this.task.due_date = this.date.value;
    if (this.task.due_date != undefined) {
      this.task.due_date = new Date(this.task.due_date);
      var dd =
        (this.task.due_date.getDate() < 10 ? "0" : "") +
        this.task.due_date.getDate();
      var MM =
        (this.task.due_date.getMonth() + 1 < 10 ? "0" : "") +
        (this.task.due_date.getMonth() + 1);
      var yyyy = this.task.due_date.getFullYear();
      var hh = this.task.due_date.getHours();
      var min = this.task.due_date.getMinutes();
      this.task.due_date = yyyy + "-" + MM + "-" + dd + " " + hh + ":" + min;
    } else {
      this.due_error = true;
      this.popUpMsg = "Please fill due date";
      this.openDialog();
      return;
    }
    this.ContactServiceService.callLog(this.task).subscribe(
      (data) => {
        this.renderData();
        this.task = {
          assigned_user_id: undefined,
          subject: undefined,
          due_date: undefined,
          contact_id: undefined,
          taskable_type: "App\\Account",
          taskable_id: undefined,
          status: "open",
        };
        this.popUpMsg = data;
        this.openDialog();
      },
      (error) => {
        console.log(error, "error report");
        this.popUpMsg = error.error.message;
        this.openDialog();
      }
    );
  }

  getASelectedVal(selected) {
    this.call.contact_id = selected.id;
    this.task.contact_id = selected.id;
    this.event.contact_id = selected.id;
  }

  getASelectedValUser(selected) {
    this.task.assigned_user_id = selected.id;
  }

  displayAssignedUserFn(obj) {
    if (obj != null && obj != undefined) {
      let name = "";
      name = obj.name;

      if (name == undefined) {
        name = obj.first_name + " " + obj.middle_name + " " + obj.last_name;
      }
      while (name.includes(null)) {
        name = name.replace(null, "").replace("  ", " ").trim();
      }
      return obj ? name : undefined;
    }
    return "";
  }
  // setUpEmailValue() {
  //   this.emailTemplate = JSON.parse(this.emailTemplate);
  //   this.mail.from_address = this.clientData.auth_user.email;
  //   this.mail.subject = this.emailTemplate.subject;
  //   this.mail.description_html = this.emailTemplate.body;

  //   console.log(this.emailTemplate);
  // }
  setUpEmailValue() {
    for (let i = 0; i < this.clientData.email_templates.length; i++) {
      // console.log(this.clientData.email_templates[i]);
      if (this.clientData.email_templates[i].id == this.emailTemplate) {
        this.checkForDynamicTemplate(this.clientData.email_templates[i]);
        this.mail.subject = this.clientData.email_templates[i].subject;
        console.log(this.clientData.email_templates[i].body);
        this.mail.description_html = this.clientData.email_templates[
          i
        ].body_html.replace(/&#(\d+);/g, function (match, number) {
          return String.fromCharCode(number);
        });
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
  //} 

 } 
setTemplatePlaceHolder(template){
  //if(template.published=='d'){
      for(let mod in this.all_fileds_val){
          console.log('['+mod+']',this.all_fileds_val[mod]);
          console.log( this.mail.description_html.indexOf('['+mod+']'));
          setTimeout(()=>{
             var repl= this.mail.description_html.replace('['+mod+']',this.all_fileds_val[mod]);
              this.mail.description_html=repl;
              console.log(this.mail.description_html);
             },50);
      }
  // }
}
  getKeys(map) {
    let arr: any[] = [];
    for (let k in map) arr.push(k);
    return arr;
  }
  fetchState() {
    this.ContactServiceService.getStateList(
      Number(JSON.parse(this.newContact.country).id)
    ).subscribe((data: any) => {
      this.stateList = data.states;
    });
  }

  fetchCity() {
    this.ContactServiceService.getCityList(
      Number(JSON.parse(this.newContact.state).id)
    ).subscribe((data: any) => {
      this.cityList = data.cities;
    });
  }
  set_extra_field_request() {
    this.customFields = [];
    $(".cust_err_frm").html("");
    //console.log(this.extraformModel);
    var i = 0;
    for (let obj in this.extraformModel) {
      //this.customFields[i]=[];
      //console.log(this.extraformModel[obj]);
      var field_obj = this.extraformModel[obj];
      var value = $("#" + field_obj.name).val();

      if (field_obj.type == "multiselect") {
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
      var radio_av =
        $("#" + field_obj.name + "_radio").length > 0 ? true : false;

      if (radio_av) {
        value = "";
        $("#" + field_obj.name + "_radio input:checked").each(function () {
          value = $(this).val();
        });
      }
      $("#" + field_obj.name).removeClass("frm-danger");
      if (field_obj.mandatory == 1 && value == "") {
        $("#" + field_obj.name).addClass("frm-danger");
        $("#" + field_obj.name + "_err_sp").html("This field is Mandatory!");
        this.popUpMsg = "Please fill all mandatory fields";
        this.openDialog();
        return false;
      }
      var vJson = {
        lead_id: this.id,
        lead_additional_field_id: field_obj.id,
        field_value: value ? value : "",
        type: field_obj.type,
        type_value: field_obj.type_value ? field_obj.type_value.toString() : "",
      };
      // console.log(value);

      this.customFields.push(vJson);
      //this.customFields[i][key]=value;
      i++;
    }
    console.log(this.customFields);
    this.newContact.custom_fields = this.customFields;
    console.log(this.newContact.custom_fields);
    //return false;
    //this.updateContact();
  }
  email_error = false;
  name_error = false;
  comp_error = false;
  status_error = false;

  updateContactSt() {
    if (this.checkStandardFiledValidation() == false) {
      console.log("ff");
      return false;
    }

    this.updateContact();
  }
  checkStandardFiledValidation() {
    var standard_error = false;
    console.log(this.newContact);
    for (let st_fld of this.standardFields) {
      if (st_fld.mandatory == 1 && (this.newContact[st_fld.name] == undefined || this.newContact[st_fld.name] == "")) {
        console.log(
          this.newContact[st_fld.name],
          st_fld.name + "--MAN--" + st_fld.mandatory
        );
        this.popUpMsg = "Please fill " + st_fld.label;
        this.openDialog();
        standard_error = true;
        return false;
      }
    }
    if (standard_error == false) {
      //return false;
    }
  }
  updateContact() {
    console.log(this.extraFields);

    if(this.set_extra_field_request()==false){
      console.log('ff')
      return false;
    }
    ;
    if (this.email_error) {
      this.popUpMsg =  "Please fill valid email id!" ;
      this.openDialog();
      return;
    }

    if (this.newContact.dob && this.newContact.dob.value) {
      this.newContact.dob = this.newContact.dob.value;
    } 
    if (
      this.newContact.last_name != undefined && 
      this.newContact.lead_status_id != undefined
    ) { 
      this.newContact.documents=this.documentData;
      this.ContactServiceService.updateClient(this.newContact).subscribe(
        (data) => {
          // alert(JSON.stringify(data));
          this.renderData();
          this.popUpMsg = data;
          this.openDialog();
          this.EditAccPop = false;
          this.EditStAccPop=false;
          this.name_error = false;
          this.comp_error = false;
          this.status_error = false;
          this.closeRightpanel();
        }
      );
    } else {
      this.name_error = true; 
      this.status_error = true;
      //this.errorMsg="Please Fill the Mandatory Fields(Last Name,  Company and lead status)";
      this.popUpMsg = "Please fill all mandatory fields.";
      this.openDialog();
      return;
    }
  }
  closeRightpanel() {
    $("body").removeClass("right-bar-enabled");
    $("body").removeClass("modal-open");
    $(".modal-backdrop").remove();
  }
  getOwnerName(id: number) {
    for (let obj of this.clientData.users) {
      if (obj.id == id) {
        return obj.name;
      }
    }
  }
  resetForm() {
    this.myControl.reset();
    this.myControl2.reset();
    this.ngOnInit();
  }
  returnAccountOwner(c: Contact) {
    if (c != undefined && c != null) {
      for (let a of this.accountList) {
        if (c.owner_id == a.id) {
          return a.name;
        }
      }
    }
  }
  returnReportingTo(c: Contact) {
    if (c != undefined && c != null) {
      for (let a of this.clientData.users) {
        if (c.reports_to_id == a.id) {
          return a.name;
        }
      }
    }
  }

  createEvent() {
    this.event.eventable_id = JSON.parse(
      JSON.stringify(this.clientDetails)
    ).account_id[0].id;
    this.event.start_date = this.EvtstartDate.value;
    this.event.end_date = this.EvtEndDate.value;
    this.ContactServiceService.createEvent(this.event).subscribe((obj) => {
      this.renderData();
      this.popUpMsg = obj;
      this.event = new EventClass();
      this.openDialog();
    });
  }
  /*Convert lead*/
  ConvertLeadPop: boolean = false;
  ConvertLeadPopShow() {
    //this.convert=new ConvertLead();
    this.convert.type = "Account";
    //this.convert.account_create_type = "";
    this.selectConv("Account");
    this.ConvertLeadPop = true;
    this.ExtCont = false;
    this.convAcc = true;
    this.CreateNewAcc();
  }
  ConvertLeadPopHide() {
    this.ConvertLeadPop = false;
    this.convAcc = true;
    this.convert.type = "PersonalAccount";
  }

  NewAccCont: boolean = false;
  ExtCont: boolean = false;
  CreateNewAcc() {
    this.NewAccCont = true;
    this.ExtCont = false;
    this.convert.search_account_id = undefined;
    this.convert.account_create_type = "new";
  }
  ChooseExistAcc() {
    this.NewAccCont = false;
    this.ExtCont = true;
    this.convert.account_name = undefined;
  }
  convAcc = true;

  selectConv(type) {
    if (type == "PersonalAccount") {
      this.convAcc = false;
    } else {
      this.convAcc = true;
    }
    this.convert.type = type;
  }
    autoAccList = []; 
  account_nameSearch: any; 
  acct_error = false;

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
    selectAccId(id,name) { 
    this.autoAccList = []; 
    this.convert.search_account_id = id; 
    this.account_nameSearch=name;
  }
  convertLead() {
    this.acct_error=false;
    this.convert.lead_id = this.id + "";
    //this.convert.type="Account";
    //this.convert.type="PersonalAccount";
    if( this.convert.type == "Account" && this.convert.account_create_type == "" ) 
    {
      this.popUpMsg = "Please Select Account Type.";
      this.openDialog();
      return false;
    }
    if( this.convert.type == "PersonalAccount" && this.convert.contact_last_name == "" ) 
    {
      this.popUpMsg = "Please add last name";
      this.openDialog();
      return false;
    }
    if( this.convert.type == "Account" && this.convert.account_create_type == "existing"
     && this.convert.search_account_id == undefined  ) {
      this.acct_error=true;
      this.popUpMsg = "Please Select Account";
      this.openDialog();
      return false;
    }
    if( this.convert.type == "Account" && this.convert.contact_last_name == "" ) 
    {
      this.popUpMsg = "Please add last name";
      this.openDialog();
      return false;
    }
    if( this.convert.type == "Account" &&  this.convert.account_create_type == "new" 
      && (this.convert.account_name == "" || this.convert.account_name == null ) ) 
    {
      this.popUpMsg = "Please add account name";
      this.openDialog();
      return false;
    } 
    this.ContactServiceService.convert(this.convert, this.id).subscribe(
      (data) => {
        this.popUpMsg = data;
        this.ConvertLeadPopHide();
        this.openDialog();
        this.router.navigate([
          "/maindashboard",
          { outlets: { bodySection: ["leaderGrid"] } },
        ]);
      },
      (error) => {
        console.log(error);
        this.popUpMsg = JSON.stringify(error.message);
        this.openDialog();
      }
    );
  }
  refreshEmail() {
    this.ContactServiceService.refreshEmail().subscribe((data) => {
      this.renderData();
    });
  }
  delete() {
    this.ContactServiceService.delete(this.clientDetails.id).subscribe(
      (obj) => {
        this.popUpMsg = obj;
        this.router.navigate([
          "/maindashboard",
          { outlets: { bodySection: ["leaderGrid"] } },
        ]);
        this.openDialog();
      }
    );
  }
  public extraformModel: any = {};
  customFields: any = [];
  extraFields: any;
  fr_options: any;
  get_additional_fields() {
    this.formService.getAllfields("Leads").subscribe((data: any) => {
      console.log(data);
      this.extraFields = data.additional_fields;

      for (var i = 0; i <= data.additional_fields.length - 1; i++) {
        this.extraformModel[i] = [];
        this.extraformModel[i][data.additional_fields[i].name] =
          data.additional_fields[i].name;
        this.extraformModel[i]["id"] = data.additional_fields[i].id;
        this.extraformModel[i]["type"] = data.additional_fields[i].type;
        this.extraformModel[i]["type_value"] =
          data.additional_fields[i].type_value;
        this.extraformModel[i]["name"] = data.additional_fields[i].name;
        this.extraformModel[i]["mandatory"] =
          data.additional_fields[i].mandatory;

        for (let custom of this.clientDetails.custom_fields) {
          if (custom.lead_additional_field_id == this.extraformModel[i]["id"]) {
            if (this.extraFields[i]["type"] == "multiselect") {
              this.extraFields[i]["value"] = custom.field_value;
              this.extraformModel[i]["type_value"] = custom.type_value;
              console.log(this.extraFields[i]["value"]);
            } else {
              this.extraFields[i]["value"] = custom.field_value;
            }
            if (this.extraFields[i]["type"] == "checkbox") {
              this.extraFields[i]["value"] = custom.field_value
                ? custom.field_value.split(",")
                : [];
              console.log(this.extraFields[i]["value"]);
            }
          }
        }

        if (data.additional_fields[i].type_value) {
          this.fr_options = [];
          for (
            var j = 0;
            j <= data.additional_fields[i].type_value.length - 1;
            j++
          ) {
            this.fr_options.push({
              id: j + 1,
              value: data.additional_fields[i].type_value[j],
            });
          }
          this.extraFields[i]["options"] = this.fr_options;
        } else {
          this.extraFields[i]["options"] = [];
        }
      }
    });
  }
  get_label_name(id) {
    // console.log(this.extraFields);
    if (this.extraFields) {
      for (let fld of this.extraFields) {
        //console.log(fld);
        if (fld.id == id) {
          return fld.label;
        }
      }
    }
  }

  ownerShipEdit = false;
  lead_new_owner_id: any;
  public ownerOptions: Select2Options;
  assignData: any = [];
  openOwnership() {
    this.ownerShipEdit = true;
    this.lead_new_owner_id = this.clientDetails.owner_id;
  }
  changeOwner() {
    var changeOwn = {
      lead_id: this.id,
      lead_new_owner_id: this.lead_new_owner_id,
    };
    this.formService.changeOwner(changeOwn, "lead").subscribe((data: any) => {
      this.closeOwner();
      this.popUpMsg = data.message;
      this.openDialog();
      this.renderData();
    });
  }
  selectBox() {
    $(".select2-container").css("z-index", 5000);
  }
  closeOwner() {
    this.ownerShipEdit = false;
  }
  renderNewView(value) {
    this.lead_new_owner_id = value;
  }
  getAllUser() {
    this.formService.getAllUsers().subscribe((data: any) => {
      console.log(data);
      if (data.users != undefined) {
        let i = 0;
        for (let e of data.users) {
          //console.log(e.id);
          this.assignData.push({ id: e.id, text: e.name });
          i++;
        }
      }
    });
  }

  to_address_list = [];
  cc_address_list = [];
  bcc_address_list = [];
  search_email(evnt, type) {
    this.to_address_list = [];
    this.cc_address_list = [];
    this.bcc_address_list = [];
    var val = evnt.target.value;
    console.log(val);
    this.formService.searh_email(val, "leads").subscribe((data: any) => {
      console.log(data);
      if (type == "to_address") {
        this.to_address_list = data.leads;
      }
      if (type == "cc_address") {
        this.cc_address_list = data.leads;
      }
      if (type == "bcc_address") {
        this.bcc_address_list = data.leads;
      }
    });
  }
  selectEmailId(acc, type) {
    if (type == "to_address") {
      this.mail.to_address = acc.email;
    }
    if (type == "cc_address") {
      this.mail.cc_address = acc.email;
    }
    if (type == "bcc_address") {
      this.mail.bcc_address = acc.email;
    }
    this.to_address_list = [];
    this.cc_address_list = [];
    this.bcc_address_list = [];
  }

  email_error_msg = "";
  validateEmail(emailField) {
    this.email_error_msg = "";
    //console.log(emailField);
    emailField = emailField.target;
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (emailField.value && reg.test(emailField.value) == false) {
      //alert('Invalid Email Address');
      this.email_error_msg = "Invalid Email Address";
      this.email_error = true;
      return false;
    } else {
      this.email_error_msg = "";
      this.email_error = false;
    }
    return true;
  }

  validate_phone(evnt) {
    //console.log(evnt.target.value);
    evnt.target.value = evnt.target.value.replace(/[^0-9-]/g, "");
    evnt.target.value = evnt.target.value.replace(/(\..*)\./g, "$1");
    return evnt.target.value;
  }

  EditStAccPop: boolean = false;
  openStandard_f = false;
  isStandard = false;
  standardFields = [];
  formTitle = "Edit Lead(standard)";
  st_formType = "Lead";
  @ViewChild("search_st")
  public searchElementRef_st: ElementRef;
  public searchControl_st: FormControl;

  openEditContactPopSt() {
    this.EditStAccPop = true;
    this.searchControl_st = new FormControl();
    setTimeout(() => {
      this.loadAddressAutocomplete_st();
    }, 500);
    setTimeout(() => {
      $("#street_add_st").val(this.fulladdr);
    }, 800);
  }
  loadAddressAutocomplete_st() {
    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef_st.nativeElement,
        {
          types: ["address"],
        }
      );
      autocomplete.addListener("place_changed", () => {
        this.country_name = "";
        this.state_name = "";
        this.city = "";
        this.zip_code = "";
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
            var street_address = "";
            var street_number = "";
            var street_route = "";
            for (var i = 0; i < place.address_components.length; i++) {
              if (place.address_components[i].types[0] == "street_number") {
                street_number = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[0] == "route") {
                street_route = place.address_components[i].long_name;
              }
              if (place.address_components[i].types[0] == "country") {
                that.country_name = place.address_components[i].long_name;
                that.country_code = place.address_components[i].short_name;
              }
              if (
                place.address_components[i].types[0] ==
                "administrative_area_level_1"
              ) {
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
          var street_add = street_number ? street_number + " " : "";
          street_address = street_add + street_route;
          this.newContact.country = this.country_name;
          this.newContact.state = this.state_name;
          this.newContact.city = this.city;
          this.newContact.zip = this.zip_code;
          this.newContact.street = street_address;
        });
      });
    });
  }
  picklistValues = [];
  load_form_data() {
    if (this.standardFields && this.standardFields.length > 0) {
      for (let k = 0; k < this.standardFields.length; k++) {
        this.picklistValues.push({ type_value: [{ id: 1, name: "nammmm" }] });
        if (this.standardFields[k].type == "picklist") {
          let that = this;
          var pick_name = this.get_picklist_name(this.standardFields[k].name);
          this.formService.load_picklist(pick_name).subscribe((data: any) => {
            console.log(k);
            this.picklistValues[k].type_value = this.setPickDropdown(
              data,
              this.standardFields[k].name
            );
            this.standardFields[k].type_value = this.setPickDropdown(
              data,
              this.standardFields[k].name
            );
            console.log(that.standardFields[k]);
          });
        }
      }
    }
  }
  get_picklist_name(picklist_selected) {
    var picklistName = "";

    if (picklist_selected == "industry_id") {
      picklistName = "industries";
    }
    if (picklist_selected == "salutation") {
      picklistName = "salutations";
    }
    if (picklist_selected == "rating_id") {
      picklistName = "ratings";
    }
    if (picklist_selected == "lead_status_id") {
      picklistName = "lead_statuses";
    }
    return picklistName;
  }
  setPickDropdown(data, picklist_selected) {
    var picklistAllValue = [];

    if (picklist_selected == "industry_id") {
      picklistAllValue = data.industries;
    }
    if (picklist_selected == "salutation") {
      picklistAllValue = data.salutations;
    }
    if (picklist_selected == "rating_id") {
      picklistAllValue = data.ratings;
    }
    if (picklist_selected == "lead_status_id") {
      picklistAllValue = data.lead_statuses;
    }
       if(picklist_selected=='itinerary_inclusions'){
        picklistAllValue=data.inclusions;
       }
    return picklistAllValue;
  }
}
class ConvertLead {
  "account_create_type": string;
  "account_name": string;
  "search_account_id": string;
  "salutation": string;
  "contact_first_name": string;
  "contact_last_name": string;
  "lead_id": string;
  "type": string;
  "custom_fields": any;
}
