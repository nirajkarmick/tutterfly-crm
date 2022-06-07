import {Component, OnInit} from '@angular/core';
import {AdminServiceService} from '../service/admin-service.service';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import {AlertBoxComponent} from '../alert-box/alert-box.component';
import {FormService} from '../service/form.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  modalAdd: boolean = false;
  modalEdit: boolean = false;
  role_permissions: any[];
  all_permissions: any[];
  all_roles = [];
  profileObj: any;
  permissionArr: number[] = [];
  name: string;
  query_param_id = '';
  profileUsers: any;
  profileName: any;
  modalAddUser = false;
  newElement: any;
  roles: any[];
  role_hierarchies: any[];
  show_role = false;
  profileId = 0;
  profileNamee = '';

  constructor(private service: AdminServiceService,
              private route: ActivatedRoute,
              private formService: FormService,
              public dialog: MatDialog) {
    if (localStorage.getItem('modulesArray') != null) {
      var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
      console.log(modulesArray);
      modulesArray.forEach(module => {
        if (module.role == true) {
          this.show_role = true;
        }
      });
    }
    this.route.queryParams.subscribe(queryParams => {

      if (queryParams.id) {
        this.query_param_id = queryParams.id;
        this.fetchAllUser(this.query_param_id);
      } else {
        this.query_param_id = '';
        this.fetchData(0);
      }
    });
    //this.fetchData();
    this.checkFBStatus();
  }

  popUpMsg: string;

  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  // showButton = true;
  isFbConneted = false;

  checkFBStatus() {
    this.formService.chekFbStatus().subscribe((data: any) => {
      this.isFbConneted = data.fb_status;
      console.log(this.isFbConneted, 'dd_fb');
    });
  }

  email_error = false;

  if(email_error) {
    this.popUpMsg = JSON.stringify('Please fill valid email id');
    this.openDialog();
    return;
  }

  email_error_msg = '';

  validateEmail(emailField) {
    this.email_error_msg = '';
    emailField = emailField.target;
    console.log(emailField.value.length);
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (emailField.value && reg.test(emailField.value) == false) {
      this.email_error_msg = "Invalid Email Address";
      this.email_error = true;
      return false;
    } else {
      this.email_error_msg = '';
      this.email_error = false;
    }
    return true;
  }

  AddToNewPermission(id: number) {
    console.log(id, 'checked');
    if (this.permissionArr.indexOf(id) == -1) {
      console.log('not fnd');
      this.permissionArr.push(id);
    } else {
      console.log('fnd');
      let pt = 0;
      for (let dt of this.permissionArr) {

        if (dt == id) {
          delete this.permissionArr[pt];
          console.log(dt);
        }
        pt++;
      }
      this.permissionArr.filter((data: number) => {
      })
    }
    console.log(this.permissionArr);


  }

  checkPermission(id: number) {
    if (this.permissionArr.filter((data: any) => {
      return data == id
    }).length > 0) {
      return true;
    }
    return false;
  }

  getObjectKeys(obj: Object) {
    return Object.keys(obj);
  }

  dtOptions: DataTables.Settings = {};
  ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true, 
          };
  }

  AddNewShow() {
    this.modalAdd = true;
  }

  AddNewHide() {
    this.modalAdd = false;
  }

  AddNewUserShow() {
    this.newElement = new Object;
    this.newElement.roles = this.query_param_id;
    this.modalAddUser = true;
    this.create_error = "";
  }

  AddNewUserHide() {
    this.modalAdd = false;
  }
create_profile(){

}
  create_error = "";

  create() {
    this.create_error = "";
    if (this.show_role == false) {
      this.newElement.role_hierarchy_id = 2;
    }
    this.service.saveUser(this.newElement).subscribe(data => {
        console.log(data)
        this.AddNewUserHide();
        this.fetchAllUser(this.query_param_id);
        this.closeUserModal();
      },
      (error) => {
        console.log(error.error.message);
        this.create_error = error.error.message;
      }
    );
  }

  closeUserModal() {
    this.modalAddUser = !this.modalAddUser;
  }

  profileUsercount = 0;

  fetchData(edit_id = 0) {
    this.service.getUserProfile().subscribe((data: any) => {
      console.log(data);
      this.role_permissions = data.role_permissions;
      this.all_permissions = data.all_permissions;

      this.all_roles = data.roles;
      let jj = 0;
      for (let rl of data.roles) {
        if (jj == 0) {
          this.profileId = rl.id;
          this.profileName = rl.name;
          this.profileUsercount = rl.user_count;
          this.SlidePermisionShow();
        }
        jj++;
      }
      if (edit_id) { 
          this.profileId = edit_id;
          this.SlidePermisionShow();
      }

    });
  }

  fetchAllUser(id) {
    this.all_roles = [];
    this.service.getUserUnderProfile(id).subscribe((data: any) => {
      this.profileName = data.role.name;
      this.roles = data.role;
      this.profileUsers = data.users;
      console.log(this.profileUsers);
    });
    this.service.getAllUserCreateGet().subscribe((meta: any) => {
      this.role_hierarchies = meta.role_hierarchies;
    });

  }

  get_permissionName(pName: any) {
    if (pName.indexOf('delet') > -1) {
      return 'Delete';
    } else if (pName.indexOf('create') > -1) {
      return 'Create';
    } else if (pName.indexOf('edit') > -1) {
      return 'Edit';
    } else if (pName.indexOf('view') > -1) {
      return 'View';
    } else if (pName.indexOf('upload') > -1) {
      return 'Upload';
    } else if (pName.indexOf('download') > -1) {
      return 'Download';
    } else if (pName.indexOf('share') > -1) {
      return 'Share';
    } else if (pName.indexOf('public') > -1) {
      return 'Public Link';
    }
    return pName;
  }



  SlidePermisionShow() {
    this.permissionArr = [];
    console.log(this.profileId);
    console.log(this.role_permissions);
    if (this.profileId > 0) {
      this.profileObj = this.role_permissions.filter((all: any) => {
        return this.profileId == all.role.id;
      })[0];
      console.log(this.profileObj);
      // this.permissionArr.push(this.profileId);
      this.profileObj.permissions.forEach((data: any) => {
        this.permissionArr.push(data.id);
      });
      this.profileObj.name = this.profileObj.role.name;

      $('#permissiionDiv').css('display', 'block');
    } else {
      $('#permissiionDiv').css('display', 'none');
    }

    let jj = 0;
    for (let rl of this.all_roles) {
      if (rl.id == this.profileId) {
        this.profileNamee = rl.name;
        this.profileUsercount = rl.user_count;
      }
      jj++;
    }
  }

  modalEditShow(data: any) {
    console.log(data);
    this.permissionArr = [];
    this.profileObj = this.role_permissions.filter((all: any) => {
      return data.id == all.role.id;
    })[0];
    this.profileObj.permissions.forEach((data: any) => {
      this.permissionArr.push(data.id);
    });
    this.profileObj.name = this.profileObj.role.name;
    this.modalEdit = true;
    $('#modalEdit').css('display', 'block');
  }

  modalEditHide() {
    this.modalEdit = false;
  }

  update() {
    this.profileObj.permissions = this.permissionArr;
    this.service.updateUserProfile(this.profileObj.role.id, this.profileObj).subscribe((data: any) => {
      this.fetchData(0);
      this.popUpMsg = JSON.stringify(data.message);
      this.openDialog();
      this.modalEdit = false;
      $('#modalEdit').css('display', 'none');
    })
  }

  save() {
    this.service.saveUserProfile(this.name).subscribe((data: any) => {
      var edit_id = data.role.id;
      this.profileId=edit_id;
      this.popUpMsg = JSON.stringify(data.message);
      this.openDialog();
      this.fetchData(edit_id);
      this.AddNewHide();

    });
  }

  delete(id: number) {
    var conf = confirm('Are you sure to delete profile ?');
    if (conf) {
      this.service.deleteUserProfile(id).subscribe(data => {
        this.fetchData(0);
      });
    }
  }

  checkAllPerm(key, event) {
    var checked = event.target.checked;

    $('.checked_' + key).each(function () {
      if (checked == true) {
        if ((this as HTMLInputElement).checked == false) {
          $(this).trigger('click');
        }
      } else {
        if ((this as HTMLInputElement).checked == true) {
          $(this).trigger('click');
        }
      }
    });
  }

  AllChecked(all_permsn) {
    var check_per = [];
    let that = this;
    all_permsn.forEach(perm => {
      check_per.push(that.checkPermission(perm.id));
    });

    if (check_per.indexOf(false) > -1) {
      return false;
    } else {
      return true;
    }
  }

  validate_phone(evnt) {
    //console.log(evnt.target.value);
    evnt.target.value = evnt.target.value.replace(/[^0-9-]/g, '');
    evnt.target.value = evnt.target.value.replace(/(\..*)\./g, '$1');
    return evnt.target.value;
  }


}
