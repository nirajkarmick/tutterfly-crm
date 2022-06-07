import {Component, OnInit,ElementRef,ViewChild,Inject,Renderer2} from '@angular/core';
import {AdminServiceService} from '../service/admin-service.service';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog} from '@angular/material';
import {AlertBoxComponent} from '../alert-box/alert-box.component'; 
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-admin-role',
  templateUrl: './admin-role.component.html',
  styleUrls: ['./admin-role.component.css']
})
export class AdminRoleComponent implements OnInit {
  modalAdd: boolean = false;
  modalEdit: boolean = false;
  role_permissions: any[];
  all_permissions: any[];
  all_roles: any[];
  profileObj: any;
  permissionArr: number[] = [];
  name: string;
  modalAddUser: boolean = false;
  allUsers: any;
  selected_role: any;
  selected_role_id: any;
  edit_role: any;
  edit_role_id: any;
  assign_users: any;
  query_param_id = '';
  user_under_role: any;
  show_role = false;

  constructor(
    private service: AdminServiceService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {


    if (localStorage.getItem('modulesArray') != null) {
      var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
      console.log(modulesArray);
      modulesArray.forEach(module => {
        if (module.role == true) {
          this.show_role = true;
        }
      });
    }
    if (this.show_role == false) {
      this.popUpMsg = JSON.stringify('You are not Authorized to view this page!');
      this.openDialog();
      this.router.navigate(['/adminMain', {outlets: {adminSection: ['dashboard']}}]);

    }
    this.route.queryParams.subscribe(queryParams => {
      console.log(queryParams);
      if (queryParams.id) {
        this.query_param_id = queryParams.id;
      } else {
        this.query_param_id = '';
      }
      this.fetchData();
    });

  }

  popUpMsg: string;

  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  AddToNewPermission(id: number) {
    if (this.permissionArr.indexOf(id) == -1) {
      this.permissionArr.push(id);
    } else {
      this.permissionArr.filter((data: number) => {
        return data != id;
      })
    }
    console.log(JSON.stringify(this.permissionArr))

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
      pageLength: 25,
      processing: true,
    };
     let script = this._renderer2.createElement('script');
  script.type = 'application/javascript';
  script.src = "assets/js/role_scripts.js";
  //script.text = '{ "@context": "https://schema.org"';
    
// script.text += ' }';
 
  this._renderer2.appendChild(this._document.body, script);
  }
AddNewUnderRoleShow(role_id){
    this.query_param_id=role_id;
    this.name='';
    this.modalAdd = true;
}
  AddNewShow() {
    this.name='';
    this.modalAdd = true;
  }

  AddNewHide() {
    this.modalAdd = false;
  }

  all_roles_related: any;
role_collections=[];
  fetchData() {
    var id = this.query_param_id;
    this.role_collections=[];
    this.service.getUserRole(id).subscribe((data: any) => {
      this.all_roles = data.role_hierarchies;
      let role_layer_count = 0;
      if (this.all_roles && this.all_roles.length > 0) {
        for (let role of this.all_roles) {
          this.role_collections.push(role);
          console.log(role);
          if (role.related_role.length > 0) {
            role_layer_count++;
            this.check_related_to(role.related_role);
            console.log(role_layer_count);
          }
        }
      }
      if (data.users) {
        this.user_under_role = data.users;
      } else {
        this.user_under_role = [];
      }
    });
  }

  check_related_to(related_data: any) {  
    console.log(related_data); 
    if(related_data && related_data.length){
        for (let rr of related_data) {
              this.role_collections.push(rr); 
              this.check_related_to(rr.related_role);
        }       
    }
  }

  backToHistory() {
    window.history.back();
  }

  modalEditShow(id, name) {
    this.edit_role = name;
    this.edit_role_id = id;
    this.modalEdit = true;
  }

  modalEditHide() {
    this.modalEdit = false;
  }

  update() {
    this.service.updateUserRole(this.edit_role_id, this.edit_role).subscribe((data: any) => {
      this.fetchData();
      this.popUpMsg = JSON.stringify(data.message);
      this.openDialog();
    });
  }

  saveNewRole() { 
    this.service.saveUserRole(this.name, this.query_param_id).subscribe((data: any) => {
       this.query_param_id = '';
      this.fetchData();
      this.name = '';
      this.popUpMsg = JSON.stringify(data.message);
      this.openDialog();
    });
  }

  assignUsers() {
    this.service.assignUserRole(this.assign_users, this.selected_role_id, this.selected_role).subscribe((data: any) => {
      this.fetchData();
      this.assign_users = [];
      this.selected_role_id = 0;
      this.selected_role = '';
      this.popUpMsg = JSON.stringify(data.message);
      this.openDialog();

    });
  }

  delete(id) {
    var conf = confirm('Are you sure to delete role ?');
    if (conf) {
      this.service.deleteUserRole(id).subscribe((data: any) => {
        this.fetchData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }


  modalAddUserShow(id, name) {
    console.log(id,'role id');
    this.modalAddUser = true;
    this.selected_role = name;
    this.selected_role_id = id;
    this.service.getAllUser(this.selected_role_id).subscribe((data: any) => {
      console.log(data);
      if (data.users) {
        this.allUsers = data.users;
      }
    });
  }

  modalAddUserhide() {
    this.modalAddUser = false;
  }

  role_tree_count = 0;

  Showhidden_row(i: any) { 
    if($('.hidden_row' + i).css('display')=='none'){
        $('.tableRole_data_hidden').css('display', 'none');   
        this.all_roles_related = this.all_roles[i].related_role;
        console.log(this.all_roles[i].related_role);
        let html = "";
        if (this.all_roles[i] && this.all_roles[i].related_role.length > 0) {   
        $('.hidden_row' + i).css('display', 'block');
          for (let role of this.all_roles[i].related_role) {
            this.role_tree_count++;
            console.log(role);
            html += this.get_html_data(role);
            if (role && role.related_role.length > 0) {
              // html += this.get_child_html(role.related_role);
              this.get_child_html(role.related_role);
            }
          }
        }
        $('#hidden_row' + i).html(html);
    }else{
        $('.tableRole_data_hidden').css('display', 'none'); 
    }
  }

  get_child_html(rel_data: any) {
    let rel_html = "";
    for (let role of rel_data) {
      this.role_tree_count++;
      console.log(role);
      rel_html += this.get_html_data_child(role);
      if (role && role.related_role.length > 0) {
        // rel_html += this.get_child_html(role.related_role);
        this.get_child_html(role.related_role);
      }
    }
    // return rel_html;

  }

  get_html_data_child(role: any) {
    var list_function='open_userlist(\''+ role.id +'\' ,\''+ role.name +'\')';
    var add_user_function='open_add_user(\''+ role.id +'\' ,\''+ role.name +'\')';
    var edit_role_function='open_edit_role(\''+ role.id +'\' ,\''+ role.name +'\')';
    var delete_role_function='open_delete_role(\''+ role.id +'\' ,\''+ role.name +'\')';
    var add_role_function='open_add_role(\''+ role.id +'\' ,\''+ role.name +'\')';
    let html = '<div class="tableRole_data">';
    html += '<div class="d-flex align-items-center justify-content-between tableRole_data_row" >';
    html += '<a>';
    html += '<h4 class="m-0">' + role.name + '</h4>';
    html += '</a>';
    html += '<p class="mb-0"><span class="mb-0 text-info d-block">Related Role <strong>' + role.related_role.length + '</strong></span>';
    if(role.users.length>0){
      html+='<span >Total User <a href="javascript:void(0)" data-toggle="modal" data-target="#roleUsers"';
      html+=' onclick="'+list_function+'"><strong>('+role.users.length+')</strong></a></span></p>';
    }else{
     html+='<span>No User</span></p>';
    }
    //html+='&nbsp; Total User <strong>' + role.users.length + '</strong></p>';
    html += '<p class="m-0"><span class="text-muted d-block">Reports To:</span><strong>' + role.parent_name + '</strong></p>';
    html += '<div class="tableRole_data_action">';
    html+=  '<a href="javascript:void(0)" class="pull-left btn btn-secondary btn-sm addUsrBtn" data-toggle="modal" data-target="#modalAdd" onclick="'+add_role_function+'">Add Role</a>';
    html += '<a href="javascript:void(0)" class="pull-left btn btn-primary btn-sm addUsrBtn" data-toggle="modal" data-target="#modalAddUser" onclick="'+add_user_function+'">Add User</a>';
    html += '<a href="javascript:void(0)" class="pull-left" data-toggle="modal" data-target="#modalEdit" onclick="'+edit_role_function+'"><i class="fas fa-edit"></i></a>';
    html += '<a href="javascript:void(0)" class="pull-left text-danger" data-toggle="modal" data-target="#close" style="margin-left:15px;" onclick="'+delete_role_function+'"><i class="fas fa-trash"></i></a>';
    html += '</div>';
    html += '</div>';
    html += '<div id="child_Role' + role.id + '" class="pt-2 pl-2"></div>';
    html += '</div>';

    setTimeout(() => {
      // alert($('#child_Role' + role.parent_id).length);
      $('#child_Role' + role.parent_id).append(html);
    }, 300); 
    // return html;
  }

  get_html_data(role: any) {
    var comma=','; 
    var list_function='open_userlist(\''+ role.id +'\' ,\''+ role.name +'\')';
    var add_user_function='open_add_user(\''+ role.id +'\' ,\''+ role.name +'\')';
    var edit_role_function='open_edit_role(\''+ role.id +'\' ,\''+ role.name +'\')';
    var delete_role_function='open_delete_role(\''+ role.id +'\' ,\''+ role.name +'\')';
    var add_role_function='open_add_role(\''+ role.id +'\' ,\''+ role.name +'\')';
    var user_list=JSON.stringify(role.users);
    let html = '<div class="tableRole_data">';
    html += '<div class="d-flex align-items-center justify-content-between tableRole_data_row" >';
    html += '<a>';
    html += '<h4 class="m-0">' + role.name + '</h4>';
    html += '</a>';
    html += '<p class="mb-0"><span class="mb-0 text-info d-block">Related Role <strong>' + role.related_role.length + '</strong></span>';
    if(role.users.length>0){
      html+='<span >Total User <a href="javascript:void(0)" data-toggle="modal" data-target="#roleUsers"';
      html+=' onclick="'+list_function+'"><strong>('+role.users.length+')</strong></a></span></p>';
    }else{
     html+='<span>No User</span></p>';
    }
    html += '<p class="m-0"><span class="text-muted d-block">Reports To:</span><strong>' + role.parent_name + '</strong></p>';
    html += '<div class="tableRole_data_action">';
    html+=  '<a href="javascript:void(0)" class="pull-left btn btn-secondary btn-sm addUsrBtn" data-toggle="modal" data-target="#modalAdd" onclick="'+add_role_function+'">Add Role</a>';
    html += '<a href="javascript:void(0)" class="pull-left btn btn-primary btn-sm addUsrBtn" data-toggle="modal" data-target="#modalAddUser" onclick="'+add_user_function+'">Add User</a>';
    html += '<a href="javascript:void(0)" class="pull-left" data-toggle="modal" data-target="#modalEdit"  onclick="'+edit_role_function+'"><i class="fas fa-edit"></i></a>';
    html += '<a href="javascript:void(0)" class="pull-left text-danger" data-toggle="modal" data-target="#close" style="margin-left:15px;" onclick="'+delete_role_function+'"><i class="fas fa-trash"></i></a>';
    html += '</div>';
    html += '</div>';
    html += '<div id="child_Role' + role.id + '" class="pt-2 pl-2"></div>';
    html += '</div>';
    this.set_viewChildEvent();

    return html;
  }
roles_user_list=[];
user_list_role='';
  showRoleUser(users:any,role_name:any){
    this.roles_user_list=users;
    this.user_list_role=role_name;
  }
  modalUserListhide(){
    this.roles_user_list=[];
    this.user_list_role='';
  }
  set_viewChildEvent(){

     //this.myTemplate.nativeElement.addEventListener('click', this.modalAddUserShow);
  }

  trigger_userList(){
    console.log(this.role_collections);
    var users=[];
    var role_id=$("#hidden_users").val();
    var role_name=  $("#hidden_role_name").val();
    for(let role of this.role_collections){
      if(role.id==role_id){
         users=role.users;
      }
    }
    this.showRoleUser(users,role_name);
  }
   trigger_add_user(){ 
    var role_id=$("#hidden_users").val();
    var role_name=  $("#hidden_role_name").val();
     
    this.modalAddUserShow(role_id,role_name);
  }
  trigger_edit_role(){
   console.log('edit');
    var role_id=$("#hidden_users").val();
    var role_name=  $("#hidden_role_name").val();
     
    this.modalEditShow(role_id,role_name);
  }
  trigger_delete_role(){
    
    var role_id=$("#hidden_users").val();
    var role_name=  $("#hidden_role_name").val();
     
    this.delete(role_id);
  }
trigger_add_role(){
    
    var role_id=$("#hidden_users").val();      
    this.AddNewUnderRoleShow(role_id);
  }

  @ViewChild('template') myTemplate: ElementRef;
}
