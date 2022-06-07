import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from '../message.service';
import { Router, ParamMap } from '@angular/router';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css']
}) 
export class FileDetailsComponent implements OnInit {
  clientDetails: any;
  users: any;
  publicLink: boolean = false;
  upFile: File;
  link: string;
  allUser: any;
  shareFileObj = {
    file_id: undefined,
    share_to_ids: [],
    share_type: 0
  }
  dataUrl: any;
  constructor(private route: ActivatedRoute, private router: Router, private service: FileService, public dialog: MatDialog, private sanitizer: DomSanitizer, private msg: MessageService) {
    this.msg.sendMessage("file");
    this.loadPermissionSet();
    let fileId = this.route.snapshot.queryParams['id'];
    if (fileId != undefined)

      service.getAllFile().subscribe((data: any) => {
        this.users = data.share_users;
        service.getFile(fileId).subscribe((data: any) => {
          this.clientDetails = data.file;
          this.allUser = data.users;
          if (this.clientDetails.file_extension == 'xls' || this.clientDetails.file_extension == 'xlsx' || this.clientDetails.file_extension == 'ppt' || this.clientDetails.file_extension == 'doc' || this.clientDetails.file_extension == 'docx') {
            this.dataUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url=" + data.url + "&embedded=true");
          } else {
            this.dataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
          }
        });
      });
  }
  upload_new_file = false;
  edit_file = false;
  delete_file = false;
  download_file = false;
  share_file = false;
  public_link_file = false;
  view_file = false;

  loadPermissionSet() {
    if (localStorage.getItem('permissionArray') != null) {
      var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
      if (permissionArray.File) {
        console.log(permissionArray.File);
        permissionArray.File.forEach(permissions => {

          if (permissions.name == 'view_file') {
            this.view_file = true;
          }
          if (permissions.name == 'upload_new_file') {
            this.upload_new_file = true;
          }
          if (permissions.name == 'edit_file') {
            this.edit_file = true;
          }
          if (permissions.name == 'delete_file') {
            this.delete_file = true;
          }
          if (permissions.name == 'download_file') {
            this.download_file = true;
          }
          if (permissions.name == 'share_file') {
            this.share_file = true;
          }
          if (permissions.name == ' public_link_file') {
            this.public_link_file = true;
          }
        });
      }

    }
    if (this.view_file == false) {
      //alert('You are not Authorized to view this page!';);
      var popUpMsg = JSON.stringify('You are not Authorized to view this page!');
      this.openDialog(popUpMsg);
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);

    }
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
  getOwner(id: number) {
    for (let user of this.allUser) {
      if (user.id == id) {
        return user.name;
      }
    }
  }
  ngOnInit() {

  }
  download() {
    this.service.downloadFileURL(this.clientDetails.id).subscribe(
      (data: any) => {
        window.open(data.url, "_blank");
      }
    );
  }
  shareFile(type: number) {
    this.shareFileObj.file_id = this.clientDetails.id;
    this.service.shareFile(this.shareFileObj).subscribe((data) => {
      // console.log(JSON.stringify(data));
      this.publicLinkDisplay(this.clientDetails.open);
      this.shareFileObj = {
        file_id: undefined,
        share_to_ids: [],
        share_type: 0
      }
      this.openDialog(JSON.stringify(data));

    });
  }

  publicLinkDisplay(type: number) {
    this.copysuccess = '';
    this.clientDetails.open = type;

    if (type == 1) {
      this.service.downloadFileURL(this.clientDetails.id).subscribe(
        (data: any) => {
          this.link = data;
        });
    }
    if (type == 2) {
      this.service.downloadFileURL(this.clientDetails.id).subscribe(
        (data: any) => {
          this.link = data.url;
        });
    }

    this.publicLink = !this.publicLink;
    setTimeout(()=>{ 
    if(this.publicLink){
      $("#publicLink").css('display','block');
      $("#publicLink").addClass('show');

    }else{
      $("#publicLink").css('display','none');
      $("#publicLink").removeClass('show');

    }     
      },200);

  }
   publicLinkDisplayClose(row: any, type: number) {
      
     
     $("#publicLink").css('display','none');
     $("#publicLink").removeClass('show');
    this.publicLink = false;

  }
  public copysuccess: any;
  copyMessage() {
    var val = this.link;
    this.copysuccess = '';
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.copysuccess = 'Copied Successfuly';
  }

}
