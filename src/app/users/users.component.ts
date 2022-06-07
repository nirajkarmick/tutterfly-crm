import {Component, OnInit, ViewEncapsulation, Input, ViewChild, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatSortModule, MatDialog, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {AdminServiceService} from '../service/admin-service.service';
import {AlertBoxComponent} from '../alert-box/alert-box.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  serviceRef: Subscription;
  DATA_LinkInfo: any[];
  roles: any[];
  role_hierarchies: any[];
  displayTable: boolean;
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort;
  displayedColumnsLinkInfo: string[];
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  newElement: any;
  users: any;
  show_role = false;
  total_active_user: any;
  total_user: any;
  total_user_license: any;
  plan_name: any;

  constructor(private service: AdminServiceService,
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
    this.fetchAllData();
  }

  dtOptions: DataTables.Settings = {};
  ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            processing: true, 
          };
  }

  closeModal() {
    this.modalAdd = !this.modalAdd;
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

  active_inactive_user(email, active_flag) {
    var msg = 'deactivate ';
    if (active_flag == 'A') {
      msg = 'activate ';
      if (this.isActive) {
        this.popUpMsg = JSON.stringify('You have purchased' + this.total_user_license + ' users license , active users must be equal or less than your plan users license.Deactivate some user or contact TutterflyCRM to extend the license!');
        this.openDialog();
        setTimeout(() => {
          this.fetchAllData();
        }, 800);
        return false;
      }
    }
    var conf = confirm('Are you sure to ' + msg + ' this user.?');
    if (conf) {
      this.service.active_inactive_user(email, active_flag).subscribe((data: any) => {
        console.log(data);
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
        this.fetchAllData();
      }, (err) => {
        this.popUpMsg = JSON.stringify(err.message);
        this.openDialog();
        this.fetchAllData();
      });
    } else {
      this.fetchAllData();
    }

  }
  send_reset_pswd(email) {

      this.service.send_reset_pswd(email).subscribe((data: any) => {
        
        if(data==1){          
          this.popUpMsg = JSON.stringify("Reset password link send to "+email+" successfully");
          this.openDialog();
        }

      });

  }
  all_users=[];
  fetchAllData() {
    this.all_users=[];
    $('body').removeClass('modal-open');
$('body').css('padding-right',0);
    $('.modal-backdrop').remove();
    this.serviceRef = this.service.getAllUserCreateGet().subscribe((meta: any) => {
      this.serviceRef = this.service.getAllUserIndex().subscribe((data: any) => {
        this.DATA_LinkInfo = data.users;
        this.users = data.users;
        for(let us of this.users){
          this.all_users.push(us);
        }
       console.log(this.all_users);
        this.total_active_user = data.total_active_user;
        this.total_user = data.total_user;
        this.total_user_license = data.total_user_license;
        this.plan_name = data.plan_name;

        if (this.total_active_user >= this.total_user_license
        ) {
          this.isActive = true;
          if (this.plan_name == 'trial' || this.plan_name == 'full') {
            this.isActive = false;
          }
        }
        console.log(this.users);
        this.displayedColumnsLinkInfo = ['sno', 'name', 'email', 'title', 'company','Last Login','action'];
        this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);

      });
      this.roles = meta.roles;
      this.role_hierarchies = meta.role_hierarchies;
    });
  }

  modalAdd: boolean = false;
  isActive = false;

  AddNewShow(element: any) {

    if (element) {
      this.service.getUser(element.id).subscribe((data: any) => {
        data.user.role_hierarchy_id = data.user.role_hierarchy_id.id;
        data.user.roles = data.user.roles.id;
        this.newElement = data.user;
      })
      this.idUpdate = element.id;
      this.buttonLable = 'Save';
    } else {
      this.newElement = new Object;
      this.buttonLable = 'Add';
    }
    this.modalAdd = true;
    console.log('ele ' + JSON.stringify(element));

  }

  AddNewHide() {
    this.modalAdd = false;
  }

  modalEdit: boolean = false;

  modalEditShow() {
    this.modalEdit = true;
  }

  modalEditHide() {
    this.modalEdit = false;
  }

  email_error = false;

  name_error = false;

  create() {
    if (this.show_role == false) {
      this.newElement.role_hierarchy_id = 2;
    }
    if (!this.newElement.last_name || !this.newElement.email || !this.newElement.roles || !this.newElement.role_hierarchy_id) {
      this.name_error = true;
      this.popUpMsg = JSON.stringify('Please fill all mandatory fields');
      this.openDialog();
      return;
    }
    if (this.email_error) {
      this.popUpMsg = JSON.stringify('Please fill valid email id!');
      this.openDialog();
      return;
    }
    this.name_error = false;
    if (this.buttonLable == 'Add') {

      console.log('this.newElement ' + this.newElement);
      this.service.saveUser(this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    } else {
      this.service.updateUser(this.idUpdate, this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }

  buttonLable = 'Add';
  idUpdate: number;

  ngOnDestroy() {
    this.serviceRef.unsubscribe();
  }

  validate_phone(evnt) {
    evnt.target.value = evnt.target.value.replace(/[^0-9-]/g, '');
    evnt.target.value = evnt.target.value.replace(/(\..*)\./g, '$1');
    return evnt.target.value;
  }

  email_error_msg = '';

  validateEmail(emailField) {
    this.email_error_msg = '';
    emailField = emailField.target;
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField.value) == false) {
      // alert('Invalid Email Address');
      this.email_error_msg = 'Invalid Email Address';
      this.email_error = true;
      return false;
    } else {
      this.email_error_msg = '';
      this.email_error = false;
    }
    return true;
  }
}
