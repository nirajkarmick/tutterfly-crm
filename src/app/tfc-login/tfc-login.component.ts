import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ParamMap ,ActivatedRoute} from '@angular/router';
import { LoginServiceService } from '../service/login-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { MatDialog } from '@angular/material';
import { Title ,Meta} from '@angular/platform-browser'; 
import {Spinkit} from 'ng-http-loader';

@Component({
  selector: 'app-tfc-login',
  templateUrl: './tfc-login.component.html',
  styleUrls: ['./tfc-login.component.css']
})
export class TfcLoginComponent implements OnInit {

  public spinkit = Spinkit;
  credentials = { email: undefined, password: undefined ,current_url:undefined};
  country: any[];
  states: any[];
  jobs: any[];
  loginForm=true;
  resetForm=false;
  verifyForm=false;
  // wangchen89football99@gmail.com
  errormsg: string = "";
  redirect_msg:string;
  popUpMsg: any;
  passErr='';
  userErr='';
  constructor(private meta:Meta,private titleService:Title,private router: Router,private route: ActivatedRoute, private lservice: LoginServiceService, private dialog: MatDialog, private chref: ChangeDetectorRef) {

      this.redirect_msg=this.route.snapshot.queryParams['message'] ? this.route.snapshot.queryParams['message'] :'';
      if(this.redirect_msg){
        this.popUpMsg=this.redirect_msg;
        this.openDialog();
      }
       this.meta.addTags([
          {name: 'description', content: 'Let us take you to your company’s login page. Sign in to your TutterflyCRM software account. Enter the email and password credentials to Log-In.'},
          {name: 'author', content: 'TutterflyCRM'},
          {name: 'keywords', content: 'TutterflyCRM Login, TutterflyCRM Signin, Access Your TutterflyCRM Account'}
        ]);
       this.titleService.setTitle('Sign in to TutterflyCRM, TutterflyCRM Customer Login');

  }
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg)
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  ngOnInit() {
    localStorage.removeItem("lActive"); 
    localStorage.setItem("lActive",Date.now().toString());
    if (localStorage.getItem('token') != undefined && localStorage.getItem('token') != null) {
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);
    }
      $('#mainContentBodyCRM').addClass('loginMainBG');
     $('#loginFrame').css('height','100vh'); 
      
      $('body').trigger('click');
     
      setTimeout(()=>{           
           $('#passw_show').trigger('click');
            $('#passw_show').focus();
             $('#email_imp').focus();
         },500);  
  }

  forgotPassword() {
    this.lservice.forgotPassword(this.credentials.email).subscribe((obj: any) => {
      this.popUpMsg = obj;
      this.openDialog();
    }, (error: any) => {
      console.log("Responce " + JSON.stringify(error.error));
      this.popUpMsg = error.error;
      this.openDialog();
    }, () => {
    })
  }

  verifyEmail(frm){
     this.lservice.verifyEmail(this.credentials).subscribe((obj:any) => {
          this.popUpMsg = obj.message;
          this.openDialog();
          this.loginshow();
        }, (error) => {      
          this.popUpMsg = error.error;
          this.openDialog();
        }, () => {
        });
  }
  public login() {
    var error=false;
    if(this.credentials.password==undefined || this.credentials.password==''){
        this.passErr="Password Required";
        error=true;
    }else{
      this.passErr='';
    }

    if(this.credentials.email==undefined || this.credentials.email==''){
        this.userErr='Email Required';
        error=true;
    }else{
        this.userErr='';
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,7})?$/;
        if (!emailReg.test(this.credentials.email)) {
            this.userErr='Invalid Email';
             error=true; 
        } else {
            this.userErr=''; 
        }
    }
    if(error==true){
      return false;
    }
    this.credentials.current_url=window.location.protocol+'//'+window.location.host;
    this.lservice.login(this.credentials).subscribe((obj: any) => {

      if(obj.error){
          this.errormsg = obj.message;
          if(this.errormsg=='Your email must be verified to login.'){
            this.loginForm=false;
            this.verifyForm=true;

          }
      }else{
          if(obj.main_domain==1){            
            this.checkDomain(obj);
          }else{
              console.log('domain');
              this.accessAcc(obj);
            

          // localStorage.setItem('user', obj.auth_user.name ? obj.auth_user.name:'user');
          // localStorage.setItem('userId', obj.auth_user.id);
          // localStorage.setItem('token', obj.token);
          // localStorage.setItem('ARole',obj.auth_user.is_admin);
          // localStorage.setItem('fromMail', obj.auth_user.email);
          // localStorage.setItem('userImage', obj.auth_user.avatar_url);
          // //set user role permission
          // localStorage.setItem('permissionArray', JSON.stringify(obj.permissions));
          // this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);
          
          }
      }
    }, error => {
      console.log("Responce " + JSON.stringify(error.error))
      this.errormsg = error.error.message;
    })

  }
 subbd="tnt1";
   public check_domain() {
    this.lservice.check_domain(this.subbd).subscribe((obj: any) => {
     console.log(obj); 
       
    }, error => {
      console.log("Responce " + JSON.stringify(error.error))
      this.errormsg = error.error.message;
    })

  }
checkDomain(obj){
  //console.log(obj);
  var subdomain=obj.auth_user.subdomain; 
 // alert(obj.auth_user.email_encrypt)
  var pwd_encrypt = obj.auth_user.pwd_encrypt.replace("=", "TFC");
  var user = obj.auth_user.email_encrypt.replace("=", "TFC");
 // var pwd_encrypt=encodeURIComponent(obj.auth_user.pwd_encrypt);
 // var user=encodeURIComponent(obj.auth_user.email_encrypt);
  //alert(subdomain+'/app/access-account/'+user+'/'+pwd_encrypt); 


  window.location.href=subdomain+'/app/access-account/'+user+'/'+pwd_encrypt;
  // this.router.navigate(['access-account/'+user+'/'+pwd_encrypt]); 

}  
validateEmail(event) {
  var email=event.target.value;
  this.userErr='';
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,7})?$/;
    if (!emailReg.test(email)) {
        this.userErr='Invalid Email'; 
    }else {
        this.userErr=''; 
    }
}

validatepass(event) {
  var pass=event.target.value;
  this.passErr='';
  
}

checkPass(event){
  var pass=event.target.value;
  if(pass==''){
    this.passErr='Password Required'; 
  }else{
    this.passErr='';
  }
}

checkEmail(event){
  var email=event.target.value;
  if(email==''){
    this.userErr='Email Required';  
  }else{
    this.userErr='';
  }
}

accessAcc(obj){
  console.log(obj);
  var subdomain=obj.auth_user.subdomain;
  // var pwd_encrypt=encodeURIComponent(obj.auth_user.pwd_encrypt);
  // var user=encodeURIComponent(obj.auth_user.email_encrypt);
  var pwd_encrypt = obj.auth_user.pwd_encrypt.replace("=", "TFC");
  var user = obj.auth_user.email_encrypt.replace("=", "TFC");
  this.router.navigate(['access-account/'+user+'/'+pwd_encrypt]); 

}
  forgotShow(){
    this.loginForm=false;
    this.resetForm=true;
  }

  loginshow(){
    this.loginForm=true;
    this.resetForm=false;
    this.verifyForm=false;
  }

 passIconShow(){
    var passwordinput = document.getElementById("passw_show");
    //this.toggleClass("fa-eye fa-eye-slash");
    var eyeicontoggle = document.getElementById('eyeicon');
    if ($("#passw_show").attr('type') === "password") {
        $("#passw_show").attr('type','text');
         $("#eyeicon").removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
        $("#passw_show").attr('type','password');
         $("#eyeicon").removeClass("fa-eye-slash").addClass("fa-eye");
    }
}

}