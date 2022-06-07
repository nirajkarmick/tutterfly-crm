import { Component, OnInit,Input,ViewChild ,ElementRef} from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

import { FileService } from '../file.service';
import { LoginServiceService } from '../service/login-service.service';
@Component({
  selector: 'app-attachment-upload',
  templateUrl: './attachment-upload.component.html',
  styleUrls: ['./attachment-upload.component.css']
})
export class AttachmentUploadComponent implements OnInit {
isLocal=false;
limitSize=8040018;
limit_message='File must be less than 8MB!';
// @Input() itineraryData:any; 
  constructor(private service: FileService,private logService: LoginServiceService,public dialog: MatDialog,) { 
 if (location.hostname.search("192.168") >= 0 || location.hostname.search("localh") >= 0
      || location.hostname.search("tnt1") >= 0  ||  location.hostname.search("adrenotravel") >= 0) {
       this.isLocal = true; 
     this.limitSize=2040018;
     this.limit_message='File must be less than 2MB!';
    }

  }

  ngOnInit() {
    console.log('open attach')
  }
  @Input() module_attachment: any;
  @Input() documentData: any;
  @Input() attachModalOpen: any;

 form_body=true;
 drive_body=false;
 folder_body=false;
 files_body=false;
  module_attachment_urls: any = [];  
  folders: any;
  folder_files: any;
  all_files_fol:any
  file_key="";

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  search_file(){ 
    if(this.file_key.length>2){
      var search_data={'page': 1, 'search_data': this.file_key ,'search_module_id': "4"};

      this.logService.searchResults(search_data).subscribe((data: any) => {
        console.log(data);
        this.folder_files=data.search_results;
        this.enableFileBody();
      });
    }else{
        this.folder_files=this.all_files_fol;
    }

  }
  enableFileBody(){    
        this.form_body=false;
        this.folder_body=false;
        this.drive_body=true; 
        this.files_body=true;
  }
  getDriveFolder(){
    this.form_body=false;
    this.drive_body=true; 

    this.service.getAllFolder().subscribe((data: any) => {
      console.log(data);
      this.folder_body=true;
      this.folders = data.file_folders;
      });
  }
  getFiles(id){
       this.enableFileBody(); 
       this.service.getAllFile(1).subscribe((data: any) => {
        console.log(data);
        this.folder_files = data.files;
        this.all_files_fol = data.files;
       });

  }
  selectFiles(file,id,name,title){
     this.module_attachment.push(title);
     this.documentData.push(file);
     console.log(this.documentData);
    $("#close_attch").trigger('click'); 
  }
  back_to_main(){
     this.form_body=true;
     this.drive_body=false;
     this.folder_body=false;
    this.files_body=false;
  }
  back_to_folder(){
     this.drive_body=true;
     this.folder_body=true;
     this.form_body=false;
    this.files_body=false;
  }
  openAttachModeal(){
    this.attachModalOpen=true;
  }
  closeAttachModeal(){
    this.attachModalOpen=false;
  }
  all_files=[];
  getFile(event) {
    let fileList: FileList = event.target.files;
    let formData: FormData = new FormData();
     
    for (var i = 0; i < fileList.length; i++) {
        formData.append('docs_'+i, fileList[i]); // file.name is optional
        this.module_attachment.push(fileList[i].name);
        console.log(fileList[i]);
  } 
    //this.documentData=formData;
}
openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg)
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  popUpMsg="";
 attachFiles(files: FileList) {
    const file = files[0];
    let form = new FormData();
    form.set("email_image", file);
    form.set("folder", 'module_attachment'); 
    
   if(file.size > this.limitSize){      
      this.popUpMsg = this.limit_message;
      this.openDialog();
      return;
    }

    this.reset_form();
    this.service.uploadFileTos3(form).subscribe((data: any) => {
      if (data.image_url) {
        this.module_attachment.push(data.name);
        this.documentData.push(data);
        console.log(this.documentData);
      } 

    }, (error) => {
      this.popUpMsg = 'File unable to upload!';
      this.openDialog();
    });


  }
  reset_form(){
    this.myInputVariable.nativeElement.value = ""; 
    $("#close_attch").trigger('click'); 
  }
   
}
