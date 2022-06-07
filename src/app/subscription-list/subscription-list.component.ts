import {Component, Input, OnInit} from "@angular/core";
import {MessageService} from "../message.service";
import {LoginServiceService} from "../service/login-service.service";
import {PullitServiceService} from "../service/pullit-service.service";
import {MatDialog} from "@angular/material";
import {AlertBoxComponent} from "../alert-box/alert-box.component";
import {FileService} from "../file.service";

import {Router} from "@angular/router";
import {Meta, Title} from "@angular/platform-browser";

@Component({
    selector: 'app-subscription-list',
    templateUrl: './subscription-list.component.html',
    styleUrls: ['./subscription-list.component.css'],
    providers: [PullitServiceService]
})
export class SubscriptionListComponent implements OnInit {
    currentTab: string;
    searchModules: any;
    userName: string;
    isAdmin: boolean;
    @Input() users: any;
    @Input() userImage: any;
    @Input() oppo: any;
    @Input() setup_mail: any;
    exampleData: any = []; 
    hamburgerToggle = false;
    MegamenuSearchToggle = false;
    mailSetup = false;
    mail_loader = false;
    popUpMsg: any;
    //userImage = 'assets/img/profiles/avatar.jpg';
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
    user_token="";
    constructor(private pullit_service: PullitServiceService,
                public dialog: MatDialog,
                private meta: Meta,
                private titleService: Title,
                private router: Router, private msg: MessageService,
                private service: LoginServiceService, private fileService: FileService) {

        if (location.hostname.search("192.168") >= 0 || location.hostname.search("localh") >= 0 || location.hostname.search("tnt1") >= 0) {
            this.show_payment = true;
        } 
        this.user_token=localStorage.getItem('userTenant')?localStorage.getItem('userTenant'):"";
        
        this.meta.addTags([
            {name: 'description', content: 'Close more deals, sell more, and grow your travel & hospitality business faster with TutterflyCRM. Sign up now for FREE CRM Trial and Demo!'},
            {name: 'author', content: 'TutterflyCRM'},
            {name: 'keywords', content: 'TutterflyCRM Signup, CRM Trail, TutterflyCRM Free Trail, TutterflyCRM Registration'}
        ]);
        this.titleService.setTitle('TutterflyCRM Payment'); 



        this.service.getSubscriptionList(this.user_token).subscribe((data: any) => {

            console.log(data.data);
            this.all_plans=data.data;
            var i=0;
            if(this.all_plans){
            for(let pln of this.all_plans){
                var j=0;
                for(let st of pln.plans){
                   // if(j==2){

                        if(i==0 && st.alias_name=='yr'){   
                            this.eco_selected=st.plan_id;
                        }
                        if(i==1 && st.alias_name=='yr'){
                            this.buss_selected=st.plan_id;
                        }
                        if(i==2 && st.alias_name=='yr'){
                            this.first_selected=st.plan_id;
                        }
                   // }
                  j++;      
                }
            i++;
            }
        }
            
        });

    }
eco_quater_price=0;
eco_half_price=0;
eco_year_price=0;
all_plans:any;

    eco_selected="";
    buss_selected="";
    first_selected="";

    buyNow(product_id,cnt){
        if(cnt==0){
            var param={plan:this.eco_selected,product:product_id};
            this.router.navigate(['proceed-payment']
                ,{queryParams:{'plan':this.eco_selected,'product':product_id}}); 
        }
        if(cnt==1){
            this.router.navigate(['proceed-payment']
                 ,{queryParams:{'plan':this.buss_selected,'product':product_id}}); 
        }
        if(cnt==2){
            this.router.navigate(['proceed-payment']
                 ,{queryParams:{'plan':this.first_selected,'product':product_id}}); 
        }

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
        var last_login_id = localStorage.getItem('userId');
        localStorage.clear();
        localStorage.setItem('last_login_id', last_login_id);
        localStorage.setItem('url', '');
        // window.location.href='https://Tutterflycrm.com/app/';
        this.router.navigate(['/']);
    }

    ngOnInit() {
        this.userName = localStorage.getItem('user');
        this.userImage = localStorage.getItem('userImage');

        this.isAdmin = localStorage.getItem('ARole') !== undefined && localStorage.getItem('ARole') === '1';
        this.users = this.userName; 
        $('body').attr('data-layout-mode', 'horizontal');
        // $('body').attr('data-layout', '{"mode": "light", "width": "fluid", "menuPosition": "fixed", "sidebar": { "color": "light", "size": "default", "showuser": false}, "topbar": {"color": "dark"}, "showRightSidebarOnPageLoad": true} data-layout-mode="horizontal"');
    }
 
 
    openAdmin() {

    }
    get_eco_price(type) {
        this.selected_plan="eco";
        this.selected_month=type;

        var cut_eco_price = 800;
        var eco_price_mon = 700;
        var eco_billed_at = 9600;
        var eco_billed_at_dis = 8400;

        if (type == 'half') {
            cut_eco_price = 800;
            eco_price_mon = Math.floor(cut_eco_price - cut_eco_price *0.05);
            eco_billed_at = cut_eco_price * 6;
            eco_billed_at_dis = eco_price_mon * 6;
        } else if (type == 'full') {
            cut_eco_price =800;
            eco_price_mon = Math.floor(cut_eco_price - cut_eco_price *0.125);
            eco_billed_at = cut_eco_price * 12;
            eco_billed_at_dis = eco_price_mon * 12;

        } else {
            cut_eco_price =800;
            eco_price_mon =800;
            eco_billed_at = cut_eco_price * 3;
            eco_billed_at_dis = eco_price_mon * 3;
        }
        $('#cut_eco_price').html(Math.floor(cut_eco_price).toString());
        $('#eco_price_mon').html(Math.floor(eco_price_mon).toString());
        $('#eco_billed_at').html(Math.floor(eco_billed_at).toString());
        $('#eco_billed_at_dis').html(Math.floor(eco_billed_at_dis).toString());
    }
    get_buss_price(type) {
        this.selected_plan="buss";
        this.selected_month=type;

        var cut_buss_price = 800;
        var buss_price_mon = 700;
        var buss_billed_at = 9600;
        var buss_billed_at_dis = 8400;
        if (type == 'half') {
            cut_buss_price = 1200;
            buss_price_mon = Math.floor(cut_buss_price - cut_buss_price *0.083);
            buss_billed_at = cut_buss_price * 6;
            buss_billed_at_dis = buss_price_mon * 6;
        } else if (type == 'full') {
            cut_buss_price =1200;
            buss_price_mon = Math.floor(cut_buss_price - cut_buss_price *0.1666);
            buss_billed_at = cut_buss_price * 12;
            buss_billed_at_dis = buss_price_mon * 12;

        } else {
            cut_buss_price =1200;
            buss_price_mon =1200;
            buss_billed_at = cut_buss_price * 3;
            buss_billed_at_dis = buss_price_mon * 3;
        }
        $('#cut_buss_price').html(Math.floor(cut_buss_price).toString());
        $('#buss_price_mon').html(Math.floor(buss_price_mon).toString());
        $('#buss_billed_at').html(Math.floor(buss_billed_at).toString());
        $('#buss_billed_at_dis').html(Math.floor(buss_billed_at_dis).toString());
        //document.getElementById('cut_buss_price').innerHTML=Math.floor(cut_buss_price);

    }

    get_first_price(type) {
        this.selected_plan="first";
        this.selected_month=type;
        var cut_first_price :any;
        var first_price_mon :any;
        var first_billed_at :any;
        var first_billed_at_dis :any;

         cut_first_price = 800;
         first_price_mon = 700;
         first_billed_at = 9600;
         first_billed_at_dis = 8400;
        if (type == 'half') {
            cut_first_price = 1800;
            first_price_mon = Math.floor(cut_first_price - cut_first_price *0.05);
            first_billed_at = cut_first_price * 6;
            first_billed_at_dis = first_price_mon * 6;
        } else if (type == 'full') {
            cut_first_price =1800;
            first_price_mon = Math.floor(cut_first_price - cut_first_price *0.125);
            first_billed_at = cut_first_price * 12;
            first_billed_at_dis = first_price_mon * 12;

        } else {
            cut_first_price =1800;
            first_price_mon =1800;
            first_billed_at = cut_first_price * 3;
            first_billed_at_dis = first_price_mon * 3;
        }
        $("#cut_first_price").html(Math.floor(cut_first_price).toString());
        $("#first_price_mon").html(Math.floor(first_price_mon).toString());
        $("#first_billed_at").html(Math.floor(first_billed_at).toString());
        $("#first_billed_at_dis").html(Math.floor(first_billed_at_dis).toString());
    }

    set_quarter_price(cnt,pln){
        this.set_plan_id(cnt,pln);
        $("#final_price_"+cnt).html(Math.floor(pln.price).toString());
        $("#final_price_mon_"+cnt).html(Math.floor(pln.price/3).toString());
        $("#final_billed_at"+cnt).html(Math.floor(pln.start_price*3).toString());

    }
    set_half_price(cnt,pln){
        this.set_plan_id(cnt,pln);
        $("#final_price_"+cnt).html(Math.floor(pln.price).toString());
        $("#final_price_mon_"+cnt).html(Math.floor(pln.price/6).toString());
        $("#final_billed_at"+cnt).html(Math.floor(pln.start_price*6).toString());

    }
    set_yearly_price(cnt,pln){
        this.set_plan_id(cnt,pln);
        $("#final_price_"+cnt).html(Math.floor(pln.price).toString());
        $("#final_price_mon_"+cnt).html(Math.floor(pln.price/12).toString());
        $("#final_billed_at"+cnt).html(Math.floor(pln.start_price*12).toString()); 

    }
    set_plan_id(cnt,pln){

        if(cnt==0){   
            this.eco_selected=pln.plan_id;
        }
        if(cnt==1){
            this.buss_selected=pln.plan_id;
        }
        if(cnt==2){
            this.first_selected=pln.plan_id;
        }
    }
    selected_plan='eco';
    selected_month='yearly';
}