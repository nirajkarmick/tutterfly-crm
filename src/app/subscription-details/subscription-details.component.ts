import {Component, Input, OnInit} from "@angular/core";
import {MessageService} from "../message.service";
import {LoginServiceService} from "../service/login-service.service";
import {PullitServiceService} from "../service/pullit-service.service";
import {MatDialog} from "@angular/material";
import {AlertBoxComponent} from "../alert-box/alert-box.component";
import {FileService} from "../file.service";

import {ActivatedRoute, Router} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";

@Component({
    selector: 'app-subscription-details',
    templateUrl: './subscription-details.component.html',
    styleUrls: ['./subscription-details.component.css'],
    providers: [PullitServiceService]
})
export class SubscriptionDetailsComponent implements OnInit {
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
    public options: Select2Options;
    show_payment = false;
    plan_id = 0;
    selected_plan_id='60e2c734dcbb4a7b23c31497';
    selected_product_id='60e2b284dcbb4a7b23c3129f';
 user_token="";
    constructor(private pullit_service: PullitServiceService,
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
        this.selected_plan_id = params['plan'];
        this.selected_product_id = params['product'];
        //alert(this.selected_month+this.selected_plan);
    }); 
        this.meta.addTags([
            {name: 'description', content: 'Close more deals, sell more, and grow your travel & hospitality business faster with TutterflyCRM. Sign up now for FREE CRM Trial and Demo!'},
            {name: 'author', content: 'TutterflyCRM'},
            {name: 'keywords', content: 'TutterflyCRM Signup, CRM Trail, TutterflyCRM Free Trail, TutterflyCRM Registration'}
        ]);
        this.titleService.setTitle('TutterflyCRM Payment');
        if(this.selected_plan_id && this.selected_plan_id){
            this.get_plan_details();
            this.get_product_details();
        }else{
            this.popUpMsg="Subscription Plan Not Found";
            this.openDialog();
            this.router.navigate(['subscription-list']); 
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

 get_plan_details(){
    this.service.getSubscriptionDetails(this.selected_plan_id,this.user_token).subscribe((data: any) => {

            console.log(data);
            if(data && data.planDetails){
                    this.planDetails=data.planDetails;
                    this.tenantDetails=data.checkout_details;   
                    if(this.planDetails.alias_name=='qtr'){
                        this.number_of_month=3;
                    }else if(this.planDetails.alias_name=='half'){
                        this.number_of_month=6;
                    }else {
                        this.number_of_month=12;
                    }
                    this.plan_price=this.planDetails.price;
                    this.plan_start_price=this.planDetails.start_price*this.number_of_month;
                    this.final_price=this.plan_price;
                    this.final_starting_price=this.plan_start_price;
            }else{
                    this.popUpMsg="Subscription Plan Not Found";
                    this.openDialog();
                    this.router.navigate(['subscription-list']); 
            }
            
        });
 }
 productDetails:any;
 tenantDetails:any;
 get_product_details(){
    this.service.getProductDetails(this.selected_product_id,this.user_token).subscribe((data: any) => {

            console.log(data);
            if(data && data.productDetails){
                    this.productDetails=data.productDetails;
            }else{
                    this.popUpMsg="Subscription Plan Not Found";
                    this.openDialog();
                    this.router.navigate(['subscription-list']); 
            }
            
        });
 }
 proceed_papply(){
    console.log(this.tenantDetails);
    var first_name=this.tenantDetails.first_name;
    var last_name=this.tenantDetails.last_name;
    var country=this.tenantDetails.address_country;
    var state=this.tenantDetails.address_state?this.tenantDetails.address_state:'';
    var email=this.tenantDetails.email; 
    var company=this.tenantDetails.company?this.tenantDetails.company:''; 
    var street=this.tenantDetails.address_street?this.tenantDetails.address_street:''; 
    var city=this.tenantDetails.address_city?this.tenantDetails.address_city:''; 
   // this.tenantDetails.pabbly_id='60f5150cb40d1c5cf306720c';
    if(this.tenantDetails.pabbly_id){
        var query="&customer_id="+this.tenantDetails.pabbly_id;
    }else{
        var query="&first_name="+first_name+"&last_name="+last_name+
    "&country="+country+"&state="+state+"&email="+email+"&company="+company+"&city="+city+"&street="+street;
    }
    
    window.location.href=this.planDetails.checkoutUrl+'?redirect_to='+this.current_url+'&quantity='+this.no_of_users+query;
}
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
 
 

    openAdmin() {

    }

    no_of_users = 1;

    changeSlider(event) {
        this.no_of_users = parseInt(event.value);
        console.log(this.no_of_users);
        this.final_price=this.plan_price*this.no_of_users;
        this.final_starting_price=this.plan_start_price*this.no_of_users;
    }

    formatLabel(value: number | null) {

        if (!value) {
            return 1;
        }
        // this.no_of_users=parseInt(value);
        // console.log(this.no_of_users);
        return value;
    }

    set_users(value) {
        this.no_of_users = parseInt(value);
        console.log(this.no_of_users);
    }
    get_eco_price(type){

    }

}