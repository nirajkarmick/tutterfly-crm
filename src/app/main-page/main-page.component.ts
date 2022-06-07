import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { LoginServiceService } from '../service/login-service.service';

import { HeaderComponent } from '../header/header.component';
@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['../../css/themes/modern.css']


})
export class MainPageComponent implements OnInit {
    users: any;
    userImage: any;
    public spinkit = Spinkit;
    loader = true;
    oppo = false;
    notif_strip = false;
    userPlan: true;
    setup_mail: any;
    @ViewChild(HeaderComponent) header: HeaderComponent;
    user_token = "";
    notes_modules="other";
    notes_module_id=0;
    notes='';
    constructor(private activatedRoute: ActivatedRoute,
        private router: Router, private service: LoginServiceService) {

        this.user_token = localStorage.getItem('userTenant') ? localStorage.getItem('userTenant') : "";
        router.events.subscribe((event) => {
            if (this.router.url == '/maindashboard/(bodySection:Dashboard)') {
                this.loader = false;
            } else {
                this.loader = true;
            }
            // if (this.router.url == '/maindashboard/(bodySection:oppoDetails)') { 

            if (event instanceof NavigationStart) {


                if (localStorage.getItem("user") !== null) {
                    this.users = localStorage.getItem('user');
                    this.userImage = localStorage.getItem('userImage');

                }
            }
            if (event instanceof NavigationEnd) {
                    this.setModuleId();
       
                if (this.router.url.indexOf("oppoDetails") > -1) {
                    this.oppo = true; 
                } else {
                    localStorage.setItem('opp_dest', ''); 
                }

                // if (localStorage.getItem("setup_mail") !== null) {
                this.setup_mail = localStorage.getItem('setup_mail');
                //alert(this.setup_mail);
                if (this.setup_mail == 0 && this.router.url.indexOf("Dashboard") > -1) {
                    this.header.setEmail();
                }

                //}
                console.log(this.router.url);
                if (this.router.url != '/login') {
                    localStorage.setItem('url', window.location.href);
                    $('#loginFrame').css('height', '100%');
                } else {
                    localStorage.setItem('url', '');
                    $('#loginFrame').css('height', '100vh');
                    console.log('login');
                }

                $('body').removeClass('modal-open');
$('body').css('padding-right',0);
                $('.modal-backdrop').remove();
                this.service.check_tfc_update(this.tfc_update_code).subscribe((data: any) => {
                    console.log(data, "user update");
                    if (data.message == 'Y') {
                        console.log('code updated');
                        //window.location.reload();
                    } else {
                        console.log('code not updated');
                        //  window.location.href=window.location.href;
                    }
                });
 

                if (this.router.url.indexOf("subscription-list") == -1 &&
                    this.router.url.indexOf("proceed-payment") == -1 &&
                    this.router.url.indexOf("payment-response") == -1) {
                    this.service.check_user_exception(this.user_token).subscribe((data: any) => {
                        console.log(data);
                        if (data.flag == 0) {
                            console.log('FFFLLLLAAAAAAAGGGFF', data.flag);
                            this.service.check_users_subscription().subscribe((sub_data: any) => {
                                console.log(sub_data, 'subdata')
                                if(sub_data.upgrade = false) {
                                    this.userPlan = sub_data.upgrade
                                }
                                if (sub_data.flag == 0) {
                                    this.router.navigate(['subscription-list']);
                                }
                            });
                        } else {
                            console.log('FFLLAAAGG', data.flag);
                        }

                    });
                }
                // }
            }
        });
    }
setModuleId(){
    if (this.router.url.indexOf("accountIndex") > -1) { 
        this.notes_modules="acc_list";
    }else if(this.router.url.indexOf("clientDetails") > -1){
        this.notes_modules="acc_det";
    }else if(this.router.url.indexOf("contactGrid") > -1){
        this.notes_modules="conc_list";
    }else if(this.router.url.indexOf("contactDetails") > -1){
        this.notes_modules="conc_det";
    }else if(this.router.url.indexOf("personalGrid") > -1){
        this.notes_modules="per_list";
    }else if(this.router.url.indexOf("personelDetails") > -1){
        this.notes_modules="per_det";
    }else if(this.router.url.indexOf("leaderGrid") > -1){
        this.notes_modules="lead_list";
    }else if(this.router.url.indexOf("leaderDetails") > -1){
        this.notes_modules="lead_details";
    }else if(this.router.url.indexOf("supplier)") > -1){
        this.notes_modules="supp_list";
    }else if(this.router.url.indexOf("supplier-details") > -1){
        this.notes_modules="supp_det";
    }else if(this.router.url.indexOf("OpportunityGrid") > -1){
        this.notes_modules="opp_list";
    }else if(this.router.url.indexOf("oppoDetails") > -1){
        this.notes_modules="opp_det";
    }else{
        this.notes_modules="other";
    }  
    var mod_id = this.activatedRoute.snapshot.queryParams['id'];
    if(mod_id){
        this.notes_module_id=mod_id;
    }else{
        this.notes_module_id=0;

    }
    console.log(this.notes_module_id,this.notes_modules);
    
    this.notes=''; 
    setTimeout(() => {
          this.get_notes();
     }, 500);
} 

    tfc_update_code = 'update_tfc_19102021';

    ngOnInit() {
        $('body').attr('data-layout', '{"mode": "light", "width": "fluid", "menuPosition": "fixed", "topbar": {"color": "dark"}}');
        $('body').attr('data-layout-mode', 'horizontal');
        if (this.router.url == '/maindashboard/(bodySection:Dashboard)') {
            // console.log('Dashboard');
            this.loader = false;
        } else {
            this.loader = true;
        }
        $('#mainContentBodyCRM').removeClass('loginMainBG');
        let that = this;
        //setInterval(function(){  that.showNotification();}, 600000);  
    }
    showNotification() {
        console.log('n');
        let that = this;
        this.notif_strip = true;
        $("#notif-strip").fadeIn('300', function () {
            setTimeout(() => {
                that.notif_strip = false;
            }, 5000);
            // $("#notif-strip").slideUp("slow", function(e) {
            //     console.log(e);
            //     $("#notif-strip").unbind();
            //     //that.notif_strip=true; 
            // });
        });
    }
    hideNotification() {
        let that = this;
        $("#notif-strip").fadeTo('slow', 0, function () {
            $("#notif-strip").slideDown("slow", function () {
                that.notif_strip = false;
            });
        });
    }

    get_notes(){
    var data={'modules':this.notes_modules,'module_id':this.notes_module_id};
    this.service.getNotes(data).subscribe((data: any) => {
      if(data && data.notes && data.notes.notes!=undefined){
         this.notes=data.notes.notes;
      }else if(data && data.notes==null){
         this.notes="";
      }
    });
  }

}
