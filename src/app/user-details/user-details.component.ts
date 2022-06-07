import { Component, OnInit, ViewEncapsulation, Input, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule, MatDialog } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userData: any[];
  userId: any;
  newElement: any;
  buttonLable = 'Save';
  roles: any[];
  role_hierarchies: any[];
  show_role=false;  
  is_user_ex=false;
  constructor(private service: AdminServiceService, private route: ActivatedRoute, public dialog: MatDialog) {
    this.userId = this.route.snapshot.queryParams['id'];
     if (localStorage.getItem('modulesArray') != null) {
        var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
        console.log(modulesArray); 
          modulesArray.forEach(module => {
            if(module.role==true){
             this.show_role=true;
            }  
         });
      }
      
    this.is_user_ex = localStorage.getItem('is_user_ex')=="0"?false:true;
    if (this.userId > 0) {
      this.fetchUserData(this.userId);
      this.fetchAllData();
    }

  }

  ngOnInit() {
  }

  fetchUserData(userId) {
    this.service.showUserDetails(userId).subscribe((data: any) => {
      this.userData = data.user;
      console.log(data);
    });
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

  validate_phone(evnt) {
    evnt.target.value = evnt.target.value.replace(/[^0-9-]/g, '');
    evnt.target.value = evnt.target.value.replace(/(\..*)\./g, '$1');
    return evnt.target.value;
  }

  closeModal() {
    this.modalAdd = !this.modalAdd;
  }
all_users=[];
  fetchAllData() {
    this.service.getAllUserCreateGet().subscribe((meta: any) => {
      this.roles = meta.roles;
      this.role_hierarchies = meta.role_hierarchies;

    });
       this.all_users=[];
       this.service.getAllUserIndex().subscribe((data: any) => { 
        for(let us of data.users){
          this.all_users.push(us);
        }
       console.log(this.all_users); 
      });
  }
  modalAdd: boolean = false;
  AddNewShow(userId: any) {
    this.modalAdd = true;
    this.buttonLable = 'Save';
    this.service.getUser(userId).subscribe((data: any) => {
      data.user.role_hierarchy_id = data.user.role_hierarchy_id.id;
      data.user.roles = data.user.roles.id;
      this.newElement = data.user;
      $("#modalAdd").addClass('show');
      $("#modalAdd").css('display', 'block');
    });

  }
  AddNewHide() {
    this.modalAdd = false;
    $("#modalAdd").removeClass('show');
    $("#modalAdd").css('display', 'none');
    $('body').removeClass('modal-open');
$('body').css('padding-right',0);
    $('.modal-backdrop').remove();
  }
  update() {
    // if(this.show_role==false){
    //   this.newElement.role_hierarchy_id=2;
    // }
    this.service.updateUser(this.userId, this.newElement).subscribe(data => {
      this.fetchUserData(this.userId);
      this.popUpMsg = JSON.stringify('User updated sucessfully!');
      this.openDialog();
      this.AddNewHide();
    });
    this.modalAdd = false;
  }

  // closeRightpanel() {
  //   $('body').removeClass('right-bar-enabled');
  // }
}
