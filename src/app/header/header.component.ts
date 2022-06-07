import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from '../message.service';
import { LoginServiceService } from '../service/login-service.service';
import { PullitServiceService } from '../service/pullit-service.service';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { FileService } from '../file.service';
import { FormService } from '../service/form.service';

import { Router ,NavigationEnd} from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { EmailClass } from './email-class';
import * as Quill from 'quill';
@Component({  
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [PullitServiceService]
})
export class HeaderComponent implements OnInit {
  currentTab: string;
  searchModules: any;
  userName: string;
  isAdmin: boolean;
  @Input() users: any;
  @Input() userImage: any;
  @Input() oppo: any;
  @Input() setup_mail: any;
  @Input() userPlan: true;
  exampleData: any = [];
  /*@Input() mobileheader: any;*/
  view_account = false;
  view_contact = false;
  view_opportunity = false;
  view_lead = false;
  view_report = false;
  view_task = false;
  view_file = false;
  view_personal_account = false;
  hamburgerToggle = false;
  MegamenuSearchToggle = false;
  mailSetup = false;
  mail_loader = false;
  popUpMsg: any;
  //userImage = 'assets/img/profiles/avatar.jpg';
  sQuery = { "search_module_id": undefined, "search_data": undefined, "page": 1 };
  showPullIt = false;
  isSetupMail: any = 0;
  random = Math.random().toString(36).substring(7);
  composeMail = false;
  compose_loader = false;

  email_templates: any;
  selected_search_module: any;
  public options: Select2Options;
  show_payment = false;
  show_notes=true;

  constructor(private pullit_service: PullitServiceService,
    public dialog: MatDialog,
    private meta: Meta,
    private titleService: Title,
    private router: Router, private msg: MessageService,
    private service: LoginServiceService, private fileService: FileService,
    private formService: FormService) {

    if (location.hostname.search("192.168") >= 0 || location.hostname.search("localh") >= 0
      || location.hostname.search("tnt1") >= 0 || location.hostname.search("tfc8") >= 0 || location.hostname.search("adrenotravel") >= 0) {
       this.show_payment = true;
     this.show_notes=true;
    }
       router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) { 
              if(this.show_notes){
                  console.log('route changes');
                  console.log(this.notes_modules); 
              }

            }
          });
    //this.all_attachment=[];
    this.options = {
      width: '100%',
      multiple: true,
      tags: true
    };
    this.msg.getMessage().subscribe(data => {
      this.currentTab = data.text;
      console.log(this.currentTab);
    })
    this.service.searchOptions().subscribe((data: any) => {
      console.log(data, 'header data')
      this.searchModules = data.search_modules;
      this.sQuery.search_module_id = data.search_modules[0].id;
      this.sQuery.page = 1;
      this.selected_search_module = data.search_modules[0].id;
      let query = JSON.parse(localStorage.getItem('search'));
      if (query && query.search_module_id) {
        this.sQuery.search_module_id = query.search_module_id;
        this.sQuery.search_data = query.search_data;
      }
    });
    this.meta.addTags([
      { name: 'description', content: 'Close more deals, sell more, and grow your travel & hospitality business faster with TutterflyCRM. Sign up now for FREE CRM Trial and Demo!' },
      { name: 'author', content: 'TutterflyCRM' },
      { name: 'keywords', content: 'TutterflyCRM Signup, CRM Trail, TutterflyCRM Free Trail, TutterflyCRM Registration' }
    ]);
    this.titleService.setTitle('TutterflyCRM');



    this.mailSetup = true;

  }

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
    this.all_attachment.splice(index, 1);  
    console.log(this.all_attachment_urls)
  }

  close_search() {
    this.sQuery.search_data = undefined;
    this.sQuery.search_module_id = this.selected_search_module;
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg)
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  random_hash() {
    let rand_char = Math.random().toString(36).substring(7);
    //window.location.search = $.query.set("rows", 10);
    // window.location.hash=rand_char;
  }
  selectBox() {
    console.log('select');
    $('.select2-container').css('z-index', 5000);
    $('.select2-container .select2-selection').css('border', 'none');
    $('.select2-container .select2-selection:focus').css('border', 'none');
    $('.select2-selection').css('border-radius', '0px')
    $('.select2-container').children().css('border-radius', '0px');
    $('.select2-container .select2-selection--multiple .select2-selection__choice').css('background-color', 'gray');
    $('.select2-container .select2-selection').attr('style', 'border: none !important');


  }
  logout() {
    this.service.logout().subscribe();
    var last_login_id = localStorage.getItem("userId");
    localStorage.clear();
    localStorage.setItem('last_login_id', last_login_id);
    localStorage.setItem('url', '');
    // window.location.href='https://Tutterflycrm.com/app/';
    this.router.navigate(['/']);
  }
is_admin_user=false;
  ngOnInit() {
    this.mail.description_html = '';
    this.userName = localStorage.getItem('user');
    this.userImage = localStorage.getItem('userImage');

    this.isAdmin = localStorage.getItem('ARole') != undefined && localStorage.getItem('ARole') == "1";
    this.is_admin_user = localStorage.getItem('is_user_ex')=="0"?false:true;
    this.users = this.userName;
    this.isSetupMail = localStorage.getItem('setup_mail');
    //alert(this.isSetupMail);
    this.loadPermissionMenu();
    //this.EmailStatus();
    this.service.getTemplates().subscribe((data: any) => {
      this.email_templates = data.email_templates;
      // console.log(this.email_templates);
    }, error => {

    });
  }
  EmailStatus() {
    this.isSetupMail = localStorage.getItem('setup_mail');
    if (this.isSetupMail == 0) {
      setTimeout(() => {
        $('#email_set').trigger('click');
      }, 1000);
    }

  }
  openEmail() {
    this.mailSetup = true;
  }
  setEmail() {
    this.EmailStatus();
  }
  setupEmails() {
    console.log('email setup api');
    this.mail_loader = true;
    this.service.setUpEmailTenant().subscribe((data) => {
      localStorage.setItem('setup_mail', "1");
      this.mail_loader = false;
      this.mailSetup = false;
      $('body').removeClass('modal-open');
$('body').css('padding-right',0);
      $('.modal-backdrop').remove();
      this.popUpMsg = data;
      this.openDialog();
      window.location.href = window.location.href;
    }, error => {
      this.mail_loader = false;
      this.mailSetup = false;

    });

  }
  hamburger() {
    this.hamburgerToggle = !this.hamburgerToggle;
  }

  megamenusearch() {
    this.MegamenuSearchToggle = !this.MegamenuSearchToggle;
  }

  loadPermissionMenu() {
    if (localStorage.getItem('permissionArray') != null) {
      var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
      if (permissionArray.Account) {
        permissionArray.Account.forEach(permissions => {
          if (permissions.name == 'view_account') {
            this.view_account = true;
          }
        });
      }
      if (permissionArray.Contact) {
        permissionArray.Contact.forEach(permissions => {
          if (permissions.name == 'view_contact') {
            this.view_contact = true;
          }
        });
      }
      if (permissionArray.Opportunity) {
        permissionArray.Opportunity.forEach(permissions => {
          if (permissions.name == 'view_opportunity') {
            this.view_opportunity = true;
          }
        });
      }
      if (permissionArray.Task) {
        permissionArray.Task.forEach(permissions => {
          if (permissions.name == 'view_task') {
            this.view_task = true;
          }
        });
      }
      if (permissionArray.Report) {
        permissionArray.Report.forEach(permissions => {
          if (permissions.name == 'view_report') {
            this.view_report = true;
          }
        });
      }
      if (permissionArray.File) {
        permissionArray.File.forEach(permissions => {
          if (permissions.name == 'view_file') {
            this.view_file = true;
          }
        });
      }
      if (permissionArray.Lead) {
        permissionArray.Lead.forEach(permissions => {
          if (permissions.name == 'view_lead') {
            this.view_lead = true;
          }
        });
      }
      if (permissionArray.PersonAccount) {
        permissionArray.PersonAccount.forEach(permissions => {
          if (permissions.name == 'view_personal_account') {
            this.view_personal_account = true;
          }
        });
      }
    }

    if (localStorage.getItem('modulesArray') != null) {
      var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
      console.log(modulesArray);
      modulesArray.forEach(module => {
        if (module.drive == true) {
          this.show_drive = true;
        }
        if (module.email_template == true) {
          this.show_email_temp = true;
        }
        if (module.pull_it == true) {
          this.show_pull_it = true;
        }
      });
    }


  }

  show_drive = false;
  show_pull_it = false;
  show_email_temp = false;

  enterText() {
    console.log(JSON.stringify(this.sQuery));
    localStorage.setItem('search', JSON.stringify(this.sQuery));
    if (this.sQuery && this.sQuery.search_data) {
      this.msg.sendQuery(this.sQuery);
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['SearchResult'] } }]);
    }

  }

  openAdmin() {

  }
  emailTemplate = "";
  mail: EmailClass = new EmailClass();
  description_html = '';
  composeFrom: any;
  setUpEmailValue() {

    for (let i = 0; i < this.email_templates.length; i++) {

      if (this.email_templates[i].id == this.emailTemplate) {
        console.log(this.email_templates[i]);
        this.mail.subject = this.email_templates[i].subject;
        this.mail.description_html = this.email_templates[i].body_html;
      }
    }
    // this.mail.from_address = this.clientData.auth_email;    
  }
  renderEmailIds(emailid: any) {
    console.log(emailid);
    this.mail.to_address = emailid;
    this.resizeemail();
    // $('.select2-container .select2-selection--multiple .select2-selection__choice').attr('style', 'background-color: gray !important');
    // $('.select2-container .select2-selection--multiple .select2-selection__choice').attr('style', 'background-color: gray !important');

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
  //all_attachment: any = ['sdvsddssdv','erhdfdfdgdfd.lkjl','dfgqwrr.lll','ewrwerwrw.wer','ewrewr','sdvsddssdv','erhdfdfdgdfd.lkjl','dfgqwrr.lll','ewrwerwrw.wer','ewrewr'];
  all_attachment: any = [];
  all_attachment_urls: any = [];
  attachFiles(files: FileList) {
    const file = files[0];
    let form = new FormData();
    form.set("email_image", file);
    let that1 = this;

    if(file.size>8040018){      
      this.popUpMsg = 'File must be less than 8MB!';
      this.openDialog();
      return;
    }
    this.fileService.uploadFileTos3(form).subscribe((data: any) => {
      if (data.image_url) {
        this.all_attachment.push(data.name);
        this.all_attachment_urls.push(data.image_url);
        this.mail.documents = this.all_attachment_urls;
      }
      console.log(this.all_attachment);
      console.log(this.mail);
      this.resizeemail();

    }, (error) => {
      this.popUpMsg = 'File unable to upload!';
      this.openDialog();
    });


  }
  removeAttachment(index) {
    this.all_attachment.splice(index, 1);
    this.all_attachment_urls.splice(index, 1);
    this.mail.documents = this.all_attachment_urls;
    this.resizeemail();
  }
  sendEmail() {
    if (this.isSetupMail == 0) {
      $('#email_set').trigger('click');
      return false;
    }

    this.mail.from_address = 'user';
    if (this.mail.subject == '') {
      this.popUpMsg = 'Please add subject!';
      this.openDialog();
      return false
    }
    if (this.mail.to_address && this.mail.to_address.length > 0) {

    } else {
      this.popUpMsg = 'Please add recipient!';
      this.openDialog();
      return false
    }
    this.compose_loader = true;
    this.mail.description = this.mail.description_html;
    this.mail.emailable_id = '';
    this.mail.emailable_type = "App\\User";
    this.service.sendMail(this.mail).subscribe(data => {
      this.popUpMsg = data;
      this.openDialog();
      this.mail = new EmailClass();
      this.compose_loader = false;
      this.composeMail = false;
      this.all_attachment = [];
      this.all_attachment_urls = [];
      this.mail.documents = [];
      this.resizeemail();
    }, error => {
      this.popUpMsg = 'Something Went Wrong!';
      this.openDialog();
      this.compose_loader = false;
    });

    //this.renderData();
  }
  composemail() {
    this.composeMail = true;
    this.mail.description_html = '';
    this.mail = new EmailClass();
    this.resizeemail();
    this.composeFrom = localStorage.getItem("fromMail");
    setTimeout(() => {
      this.selectBox();
    }, 100);

  }
  closecomposemail() {
    this.composeMail = false;
  }
  resizeemail() {
    /*alert('hi');*/
    setTimeout(function () {
      var bodyContainerHeight = $(window).height();
      var composeMailHeadertop = $('#composeMailHeadertop').innerHeight();
      var composebottomSendbtn = $('#composebottomSendbtn').innerHeight();
      var composemailtopbottom = composeMailHeadertop + composebottomSendbtn + 72;
      //console.log(composeMailHeadertop);
      $('#composemaileditor .ql-editor').css({ 'min-height': (bodyContainerHeight - composemailtopbottom) + 'px' });
      $('#composemaileditor .ql-editor').css({ 'height': (bodyContainerHeight - composemailtopbottom) + 'px' });

      // console.log(composemailtopbottom);
    }, 200);

  }
  sticky_div=false; 
  @Input() notes_modules: any;
  @Input() notes_module_id: any;
  @Input() notes: any;
  save_notes(nt){
  //  console.log(this.notes);
  //Authorization: "Bearer "+ localStorage.getItem('token')
    var data={
      'modules':this.notes_modules,'notes':this.notes,'module_id':this.notes_module_id};
    this.service.addNotes(data).subscribe((data: any) => {

    });
  }
  get_notes(){
    this.notes='';
    var data={'modules':this.notes_modules,'module_id':this.notes_module_id};
    this.service.getNotes(data).subscribe((data: any) => {
      if(data && data.notes && data.notes.notes!=undefined){
         this.notes=data.notes.notes;
      }
    });
  }
  closeSticky(){
    this.sticky_div=false;
  }
  openSticky(){
    this.sticky_div=true;
    
  }
}