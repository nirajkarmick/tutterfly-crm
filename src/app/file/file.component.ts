import { Component, OnInit ,ViewChild} from '@angular/core';
import { FileService } from '../file.service';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { MessageService } from '../message.service';
import { Router, ParamMap } from '@angular/router';
import { FileGridComponent } from '../file-grid/file-grid.component';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {
  popUpMsg:string;
  folderName: string;
  folderId:number;
  files: any;
  sFiles: any;
  folders: any;
  users: any[];
  upFile: File;
  index: number = 0;
  @ViewChild(FileGridComponent) file_grid: FileGridComponent; 
  EditFileDetails:boolean=false;
  FileUploadPop:boolean=false;
  sTab = "Owned by me";
  fileName:any;
  fileLoader:boolean;
  uploadMsg:string;
  fileLoaderSmall:boolean;
  fileLoaderSuccess:boolean;
  folderDisplayColumns: any[] = [{ name: "name", alias_name: "Name" }, { name: "created_by", alias_name: "Owner" }, { name: "updated_at", alias_name: "Last Modified Date" }, { name: "id", alias_name: "Options" }];
  filesDisplayColumns: any[] = [{ name: "title", alias_name: "Name" }, { name: "folder_detail", alias_name: "Folder" }, { name: "created_by", alias_name: "Owner" }, { name: "updated_at", alias_name: "Last Modified Date" }, { name: "id", alias_name: "Options" }];
  sFilesDisplayColumns: any[] = [{ name: "title", alias_name: "Name" }, { name: "created_by", alias_name: "Owner" }, { name: "updated_at", alias_name: "Last Modified Date" }, { name: "id", alias_name: "Options" }];
  breadCrumbs=[];

  addFIle(files: FileList) { 
    this.upFile =files[0];
    this.FileUploadPop=true;
    setTimeout(()=>{      
      $("#FileUploadPop").css('display','block');
      $("#FileUploadPop").addClass('show');
      },200);
   // this.fileLoader=true;
    this.fileName=this.upFile.name;
    console.log(this.fileName);
    this.fileLoaderSmall=true;
    this.fileLoaderSuccess=false;
     
    let form = new FormData();
    form.set("file_upload", this.upFile);
    if(this.folderId!=undefined){
      form.set("file_folder_id",this.folderId+"");
    }
    console.log(form);
    this.service.uploadFile(form).subscribe((data:any) => {
      
      this.uploadMsg=data.message;
      this.fileLoaderSmall=false;
       this.fileLoaderSuccess=true; 
       if(this.folderId>0){        
          this.selectedFolderId(this.folderId);
       }else{
           
       this.refreshFiles(); 
       }
        $(".inputfileUpl").val(null);
       //this.close();
    },(error)=>{
      this.uploadMsg=error.error.message; 
      this.fileLoaderSmall=false;
      this.fileLoaderSuccess=true;
      $(".inputfileUpl").val(null);
      // this.openDialog(JSON.stringify(error.error));
    });

  }

close(){
  this.FileUploadPop=false;
}
  load() {
    // ,{"file_upload":file}
    let form = new FormData();
    form.set("file_upload", this.upFile);
    form.set("file_folder_id", this.folderId+"");
    this.service.uploadFile(form).subscribe((data) => {
      this.openDialog(JSON.stringify(data));
      this.refreshFiles();
    },(error)=>{
      this.openDialog(JSON.stringify(error.error));
    });
  }
  changeTab(index: number) {
    this.index = index;
    this.breadCrumbs=[];
    if (index == 0) {
      this.sTab = "Owned by me";
      this.refreshFiles();
    } else if (index == 1) {
      this.sTab = "Shared with me";
      this.refreshSharedFiles();
    } else if (index == 2) {
      this.sTab = "All Folders";
      this.folderId=undefined;
      this.refreshFolders();
    }
    else if (index == 3) {
      this.sTab = "Shared with me by Admin";
      this.refreshSharedFilesByAdmin();
    }
    this.breadCrumbs.push({'index':index,"Name":this.sTab,id:-1});
    localStorage.setItem('crumbs',JSON.stringify(this.breadCrumbs));
  }
upload_btn_show=false;
  checkPermission(){
     
     if(localStorage.getItem('permissionArray')!=null){
        var permissionArray=JSON.parse(localStorage.getItem('permissionArray'));
        if(permissionArray.File){
          let that=this;
            permissionArray.File.forEach(permissions=>{
              if(permissions.name=='create_file'){
                that.upload_btn_show=true; 
              }
              //that.add_btn_show=false; 
            });           
        }
      }
      if (localStorage.getItem('modulesArray') != null) {
      var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
      console.log(modulesArray); 
        modulesArray.forEach(module => {
          if(module.drive==true){
           this.show_drive=true;
          } 
        });
      }
    if (this.show_drive == false) { 
      this.popUpMsg = JSON.stringify('You are not Authorized to view this page!');
      this.openDialog(this.popUpMsg);
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);

    }
  }
show_drive=false;
  view_file=false;
     loadPermissionSet() {
        if (localStorage.getItem('permissionArray') != null) {
            var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
            if (permissionArray.File) {
              console.log(permissionArray.File);
                permissionArray.File.forEach(permissions => {
                    if (permissions.name == 'view_file') {
                        this.view_file = true;
                    }
                });
            }

          }
          if(this.view_file==false){
            //alert('You are not Authorized to view this page!');
            this.popUpMsg=JSON.stringify('You are not Authorized to view this page!');
            this.openDialog(this.popUpMsg);
             this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);

          }
  }
  updateGridValue(flag:any){
    console.log('grid update');
    this.changeTab(this.index); 
  }
  constructor(private service: FileService,private router: Router, public dialog: MatDialog,private msg :MessageService) {
    this.msg.sendMessage("file");
    this.loadPermissionSet();
    this.refreshFiles();
    msg.getId().subscribe(data=>{
      if(data!=undefined)
      this.selectedFolderId(data);
    });
    this.checkPermission();
  }
  openDialog(popUpMsg: string): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: popUpMsg
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  ngOnInit() {
    this.breadCrumbs=[{'index':0,"Name":"Owned by me"}];
    localStorage.setItem('crumbs',JSON.stringify(this.breadCrumbs));
  }
  createFolder() {
    this.service.createFolder({ name: this.folderName, "parent_id":this.folderId }).subscribe(data => {
      this.openDialog(JSON.stringify(data));
      this.refreshFolders();
    });
  }
  curr_page = 2;
  totalData: any;
  totalCurrent = 10;
  initial_data:any;
  showMoreButton=true;
  loadMoreData(){
      this.folderId=undefined;
      this.service.getAllFile(this.curr_page).subscribe((data: any) => {
      this.FileUploadPop=false;
      this.uploadMsg='';
      this.curr_page=this.curr_page+1;
      var cnt=Object.keys(data.files).length;
      console.log(cnt);
      this.totalCurrent=this.totalCurrent+cnt;
      console.log(this.totalCurrent);
      if(cnt  > 0){
            for(let index in data.files){
             // console.log(data.files[index]);
             // this.files.data.splice(1,1);
              this.files.data.push(data.files[index]);
            }
            this.showMoreButton=true;
      }else{
        this.showMoreButton=false;
        console.log('thats all');
      }
      //console.log(this.raw_files);
      console.log(this.files);
      //this.files=this.raw_files; 
      this.file_grid.change_data(this.files);   
    });
  }
  raw_files:any;
  refreshFiles() {
    console.log(this.folderId,'refresh')
   // this.uploadMsg='';
   this.raw_files=[];
   if(this.folderId!=undefined){
      
      this.service.loadNextFolder(this.folderId).subscribe((data: any) => {
        this.FileUploadPop=false;
        this.uploadMsg='';
        this.curr_page=2;
        this.users = data.users;
        this.totalData=data.total;
        this.totalCurrent = 10;
        this.folders = { data: data.file_folders, col: ["name", "created_by", "updated_at","id"] ,parentId:this.folderId};
        this.files = { data: data.files, col: ["title", "folder_detail", "created_by", "updated_at","id"],parentId:this.folderId};
        this.sFiles = { data: data.files, col: ["title", "folder_detail", "created_by", "updated_at","id"],parentId:this.folderId};
        this.raw_files=this.files;

      });

    }else{
      this.folderId=undefined;
       this.service.getAllFile(1).subscribe((data: any) => {
      this.FileUploadPop=false;
      this.uploadMsg='';
      this.curr_page=2;
      this.users = data.share_users;
      this.totalData=data.total;
      this.totalCurrent = 10;
      this.files = { data: data.files, col: ["title", "folder_detail", "created_by", "updated_at","id"],users:this.users };;
      this.raw_files=this.files;
      console.log(this.files);
    });
    }
    
   

  }
  refreshSharedFiles() {
    this.folderId=undefined;
    this.service.getAllSharedFile().subscribe((data: any) => {
      this.sFiles = { data: data.files, col: ["title", "created_by", "updated_at","id"] ,users:this.users};
    });
    
  }
  refreshSharedFilesByAdmin() {
    this.folderId=undefined;
    this.service.getAllSharedFileByAdmin().subscribe((data: any) => {
      this.sFiles = { data: data.files, col: ["title", "created_by", "updated_at","id"] ,users:this.users};
    });
    
  }
  refreshFolders() {
    this.folderId=undefined;
    this.service.getAllFolder().subscribe((data: any) => {
      this.folders = { data: data.file_folders, col: ["name", "created_by", "updated_at","id"] ,users:this.users};
    });

  }
  selectedFolderId(id:number){
    console.log('selectedFolderId')
    if(id==-1){
      this.changeTab(this.index);
    }else{
      this.folderId=id;
      if(localStorage.getItem('fname')){
        this.breadCrumbs.push({'id':this.folderId,"Name":localStorage.getItem('fname')});
        localStorage.removeItem('fname')
        localStorage.setItem("crumbs",JSON.stringify(this.breadCrumbs));
      } 
      this.service.loadNextFolder(id).subscribe((data: any) => {
        this.users = data.users;
        this.folders = { data: data.file_folders, col: ["name", "created_by", "updated_at","id"] ,parentId:id};
        this.files = { data: data.files, col: ["title", "folder_detail", "created_by", "updated_at","id"],parentId:id};
        this.sFiles = { data: data.files, col: ["title", "folder_detail", "created_by", "updated_at","id"],parentId:id};
        this.folders.data.push(...this.files.data);
      });
    }
  }
}
