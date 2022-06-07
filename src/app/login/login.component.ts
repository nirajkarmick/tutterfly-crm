import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ParamMap } from '@angular/router';
import { LoginServiceService } from '../service/login-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = { email: undefined, password: undefined };
  client: Client = new Client();
  country: any[];
  states: any[];
  jobs: any[];
  // wangchen89football99@gmail.com
  errormsg: string = "";
  constructor(private router: Router, private lservice: LoginServiceService, private dialog: MatDialog, private chref: ChangeDetectorRef) {
  }
  popUpMsg: any;
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg)
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  loginPop: boolean = false;
  loginPopShow() {
    this.loginPop = true;
    this.signupPop = false;
    this.forgotPassPop = false;
  }
  loginPopHide() {
    this.loginPop = false;
    this.signupPop = false;
    this.forgotPassPop = false;
  }
  signupPop: boolean = false;
  signupPopShow() {
    this.lservice.defaultData().subscribe((data: any) => {
      this.country = data.countries;
      this.jobs = data.titles;
      this.chref.detectChanges();
    })
    this.signupPop = true;
    this.loginPop = false;
    this.forgotPassPop = false;
  }
  signupPopHide() {
    this.signupPop = false;
    this.loginPop = false;
    this.forgotPassPop = false;
  }

  forgotPassPop: boolean = false;
  forgotPassPopShow() {
    this.forgotPassPop = true;
    this.signupPop = false;
    this.loginPop = false;
  }
  forgotPassPopHide() {
    this.forgotPassPop = false;
    this.signupPop = false;
    this.loginPop = false;
  }
  ngOnInit() {
    if (localStorage.getItem('token') != undefined && localStorage.getItem('token') != null) {
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);
    }
  }

  forgotPassword() {
    this.lservice.forgotPassword(this.credentials.email).subscribe((obj: any) => {
      // alert(obj.data);
      this.popUpMsg = obj;
      this.openDialog();
      // this.errormsg = obj.message;
    }, (error: any) => {
      console.log("Responce " + JSON.stringify(error.error));
      this.popUpMsg = error.error;
      this.openDialog();
    }, () => {
      // this.popUpMsg = { "message": 'User not found' };
      // this.openDialog();
    })
  }
  public login() {
    this.lservice.login(this.credentials).subscribe((obj: any) => {
     console.log(obj.auth_user); 
      if(obj.error){
          this.errormsg = obj.message;
      }else{

          localStorage.setItem('user', obj.auth_user.name ? obj.auth_user.name:'user');
          localStorage.setItem('userId', obj.auth_user.id);
          localStorage.setItem('token', obj.token);
          localStorage.setItem('ARole',obj.auth_user.is_admin);
          localStorage.setItem('fromMail', obj.auth_user.email);
          //set user role permission
          localStorage.setItem('permissionArray', JSON.stringify(obj.permissions));
          // let url=localStorage.getItem("url");
          // if(url){ 
          //   localStorage.removeItem("url");
          //   window.location.href = url;
          // }else{
            this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);
          //}
      }
    }, error => {
      console.log("Responce " + JSON.stringify(error.error))
      this.errormsg = error.error.message;
    })

  }
  register() {
    if (this.client.address_country != undefined) {
      this.client.address_country = JSON.parse(this.client.address_country).name;
    }
    this.lservice.register(this.client).subscribe((data) => {
      this.popUpMsg = data;
      this.openDialog();
      this.client = new Client();
    }, err => {
      this.popUpMsg = err.error;
      this.openDialog();
    })
  }

}
class Client {
  first_name: string;
  last_name: string;
  title: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
  company_name: string;
  employees: string;
  address_country: any;
  address_state: string;


}