import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-admin-left-menu',
  templateUrl: './admin-left-menu.component.html',
  styleUrls: ['./admin-left-menu.component.css']
})
export class AdminLeftMenuComponent implements OnInit {
  @Input() activeUrl='dashboard';
  show_email_temp=false;
  show_role=false;
  isLocal=false;
  isSupplier=true;
  is_user_ex=false;
  constructor() {
       if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 || 
        location.hostname.search("tnt1")>=0 ||  location.hostname.search("dorjee")>=0
         ||  location.hostname.search("adrenotravel")>=0){ 
          this.isLocal=true;         
          this.isSupplier=true;   
        }               
      if (localStorage.getItem('modulesArray') != null) {
        var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
      //  console.log(modulesArray); 
          modulesArray.forEach(module => {
            if(module.role==true){
             this.show_role=true;
            } 
            if(module.email_template==true){
             this.show_email_temp=true;
            } 
          });
      }
       
    this.is_user_ex = localStorage.getItem('is_user_ex')=="0"?false:true;

    //this.is_user_ex = localStorage.getItem('is_user_ex') != undefined && localStorage.getItem('is_user_ex') == 1;

     // alert(this.is_user_ex);

    this.loadPermissionSet();
  }
  ngOnInit() {
  }

  loadPermissionSet() {
    if (localStorage.getItem('permissionArray') != null) {
      var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
      if (permissionArray.User) {
        console.log(permissionArray.User);
        // permissionArray.Account.forEach(permissions => {

        //   if (permissions.name == 'view_account') {
        //     this.view_account = true;
        //   }
        //   if (permissions.name == 'create_account') {
        //     this.create_account = true;
        //   }
        //   if (permissions.name == 'edit_account') {
        //     this.edit_account = true;
        //   }
        //   if (permissions.name == 'delete_account') {
        //     this.delete_account = true;
        //   }
        //   if (permissions.name == 'upload_account') {
        //     this.upload_account = true;
        //   }
        //   if (permissions.name == 'download_account') {
        //     this.download_account = true;
        //   }
        // });
      }

    }
   
  }
}
