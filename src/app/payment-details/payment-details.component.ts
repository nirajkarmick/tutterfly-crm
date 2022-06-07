import {Component, Input, OnInit} from "@angular/core";
import {MessageService} from "../message.service";
import {LoginServiceService} from "../service/login-service.service"; 
import {MatDialog} from "@angular/material";
import {AlertBoxComponent} from "../alert-box/alert-box.component";
import {FileService} from "../file.service";

import {ActivatedRoute, Router} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";

@Component({ 
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css'], 
})
export class PaymentDetailsComponent implements OnInit {
    currentTab: string;
    searchModules: any;
    userName: string;
    isAdmin: boolean;
    @Input() users: any;
    @Input() userImage: any;
    @Input() oppo: any;
    @Input() setup_mail: any;
    exampleData: any = [];
    /*@Input() mobileheader: any;*/ 
    hamburgerToggle = false;
    MegamenuSearchToggle = false;
    mailSetup = false;
    mail_loader = false;
    popUpMsg: any;
    // userImage = 'assets/img/profiles/avatar.jpg';
    sQuery = {"search_module_id": undefined, "search_data": undefined, "page": 1};
    showPullIt = false;
    isSetupMail: any = 0;
    random = Math.random().toString(36).substring(7);
    composeMail = false;
    compose_loader = false;

    email_templates: any;
    selected_search_module: any; 
    show_payment = false;
    plan_id = 0;
    selected_host_id='0a4de40827071545e8718441d35cdb8c:2aced5798b6295608507139c4319d5734a5a3bc33a97cefd95387af216b6c72a6175d9aa8c16f3bf2205fe9160eeb575c2dc58dd4be8bf50fcc69a8ec1368295f46ac1ed76083ca89e4654af6659626a7509c4641c939f1402dcdb511be9503401a6264439441c093bb01e2bdcdf9df7396395b17e523fa75d8576881d2ba2c1114fc2478ddb685f314890acf97094408d291a5090222369c6a2c42d60c35768e7597094e354b69d96e7dd7b1b367442aa01273acbf39bd1fb925c7da376f210'; 

    user_token="";
    constructor(
                public dialog: MatDialog,
                private meta: Meta, private _route: ActivatedRoute,
                private titleService: Title,
                private router: Router, private msg: MessageService,
                private service: LoginServiceService, private fileService: FileService) { 

        if (location.hostname.search("192.168") >= 0 || location.hostname.search("localh") >= 0 || location.hostname.search("tnt1") >= 0) {
            this.show_payment = true;
        } 
        this.user_token=localStorage.getItem('userTenant')?localStorage.getItem('userTenant'):"";
        
        this._route.queryParams.subscribe(params => {
        this.selected_host_id = params['hostedpage']; 
        //alert(this.selected_month+this.selected_plan);
    }); 
        this.meta.addTags([
            {name: 'description', content: 'Close more deals, sell more, and grow your travel & hospitality business faster with TutterflyCRM. Sign up now for FREE CRM Trial and Demo!'},
            {name: 'author', content: 'TutterflyCRM'},
            {name: 'keywords', content: 'TutterflyCRM Signup, CRM Trail, TutterflyCRM Free Trail, TutterflyCRM Registration'}
        ]);
        this.titleService.setTitle('TutterflyCRM Payment');
        if(this.selected_host_id  ){
            this.get_plan_details(); 
        }else{

                this.sucessMsg="Something went wrong";
                this.isError=true;
                setTimeout(()=>{
                        this.load_content=true;
                 },1500);
               
            // this.popUpMsg="Something went wrong";
            // this.openDialog();
            // this.router.navigate(['subscription-list']); 
       }
this.current_url=window.location.protocol+'//'+window.location.host+'/app/payment-response?';
    }
    current_url="";
 planDetails:any;
 number_of_month=12;
 final_price=0;
 final_starting_price=0;
 plan_price=0;
 plan_start_price=0;
 response_data=['response'];
 isError=false;
 sucessMsg="" ; 
    loader=false;
    load_content=false;
 get_plan_details(){
 	this.loader=true;
    this.service.subscription_update(this.selected_host_id,this.user_token).subscribe((data: any) => {

            console.log(data);
            this.response_data=data.data;
            this.load_content=true;
            if(data.status=="success"){
            	this.isError=false;
            	this.sucessMsg="Payment Done Successfully";
            }else{
            	this.sucessMsg="Payment not done";
            	this.isError=true;
            }
            this.loader=false;
             
            
        });
    setTimeout(()=>{
           this.loader=false;
         },2000);
 }
 productDetails:any; 
 
  
    openDialog(): void {
        let dialogRef = this.dialog.open(AlertBoxComponent, {
            width: '250px',
            data: JSON.stringify(this.popUpMsg)
        });

        dialogRef.afterClosed().subscribe(result => {
        });
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

    ngOnInit() {
        this.userName = localStorage.getItem('user');
        this.userImage = localStorage.getItem('userImage');

        this.isAdmin = localStorage.getItem('ARole') != undefined && localStorage.getItem('ARole') == "1";
        this.users = this.userName;
        this.isSetupMail = localStorage.getItem('setup_mail'); 
        $('body').attr('data-layout-mode', 'horizontal');
    }
 
 

  

}