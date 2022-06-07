import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {LoginServiceService} from '../service/login-service.service';
@Component({
  selector: 'app-access-account',
  templateUrl: './access-account.component.html',
  styleUrls: ['./access-account.component.css']
})
export class AccessAccountComponent implements OnInit {

     constructor(    private router: Router,private _route: ActivatedRoute,private lservice:LoginServiceService) {
      
        this.accessdata.email = this._route.snapshot.params['email'].replace("TFC", "=");   
        this.accessdata.password =this._route.snapshot.params['psw'].replace("TFC", "=");  
        this.postdata.email = this.accessdata.email;    
        this.postdata.psw = this.accessdata.password;  
        this.credentials.email=this.accessdata.email;   
        this.credentials.password=this.accessdata.password; 
      //  this.accessdata.email = decodeURIComponent(this._route.snapshot.params['email']);   
      //  this.accessdata.password = decodeURIComponent(this._route.snapshot.params['psw']); 
    }
   
    public postdata:any = {};
     public accessdata:any = {};
    sucessMsg = '';
    errMsg = '';
    loader=false;
  loginForm=true;
  resetForm=false;
  verifyForm=false;
     credentials = { email: undefined, password: undefined,current_url:undefined };

  ngOnInit() {
    localStorage.removeItem("lActive"); 
    localStorage.setItem("lActive",Date.now().toString());
    this.postdata.current_url=window.location.host;
    console.log(this.postdata);
    this.accessAcc();
  }
    accessAcc() {
       this.loader=true;
       this.sucessMsg = '';
       this.errMsg = ''; 
    this.accessdata.current_url=window.location.protocol+'//'+window.location.host;
       this.lservice.accessAccount(this.accessdata).subscribe((data:any) => {
        console.log(data);

        this.credentials.email=data.auth_user.email;   
        this.credentials.password=data.auth_user.pwd_encrypt; 
            this.login();
            this.loader=false;
            this.sucessMsg = data.message;
        }, err => {
            this.loader=false;
            this.errMsg = err.error;            
        });

    }

    public login() {
    this.credentials.current_url=window.location.protocol+'//'+window.location.host;
    this.lservice.login(this.credentials).subscribe((obj: any) => {
   console.log(obj);
      if(obj.error){
          this.errMsg = 'Something get wrong.Please login again';
          this.router.navigate(['login']); 
      }else{

          localStorage.setItem('user', obj.auth_user.name ? obj.auth_user.name:'user');
          localStorage.setItem('company_name', obj.auth_user.company_name);
          localStorage.setItem('company_logo', obj.auth_user.company_logo);
          localStorage.setItem('userId', obj.auth_user.id);
          localStorage.setItem('token', obj.token);
          localStorage.setItem('ARole',obj.auth_user.is_admin);
          localStorage.setItem('is_user_ex',obj.auth_user.is_user_ex);
          localStorage.setItem('fromMail', obj.auth_user.email);
          localStorage.setItem('userImage', obj.auth_user.avatar_url);
          localStorage.setItem('userTenant', obj.auth_user.tenant_id);
          localStorage.setItem('setup_mail', obj.auth_user.setup_mail?obj.auth_user.setup_mail:0);
          //set user role permission
          localStorage.setItem('permissionArray', JSON.stringify(obj.permissions));

          localStorage.setItem('modulesArray', JSON.stringify(obj.plan_set));
          //console.log(obj.plan_set[0].account);
          let url=localStorage.getItem("url");
          if(url){ 
            localStorage.removeItem("url");
            window.location.href = url;
          }else{
             this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);
          }
          
      }
    }, error => {
      console.log("Responce " + JSON.stringify(error.error))
      this.errMsg = error.error.message;
    })

  }

}
