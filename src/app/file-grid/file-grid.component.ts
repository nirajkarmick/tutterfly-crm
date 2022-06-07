import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, Output,OnChanges, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FileService } from '../file.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { identifierName } from '@angular/compiler';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-file-grid',
  templateUrl: './file-grid.component.html',
  styleUrls: ['./file-grid.component.css']
})
export class FileGridComponent implements OnInit, OnChanges {
  @Output() selectedFolderId = new EventEmitter<number>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() updateGridValue = new EventEmitter<any>();
  @Input() displayColumns: any[] = [];
  breadCrumbs = [];
  keys: string[] = [];
  updateFile: File;
  dataUrl: any;
  uploadNewVersion = false;
  previewImage = false;
  shareFileObj = {
    file_id: undefined,
    share_to_ids: [],
    share_type: 0
  }
  @Input() set getKeys(k: any[]) {
    // this.keys=k;
    this.chref.detectChanges();  
  }
  editFile = {
    title: undefined, name: undefined,
    description: undefined, parent_id: undefined
  }
  _source: MatTableDataSource<File> = new MatTableDataSource();;
  sourceData: any[] = [];
  all_data:any;
  @Input() set source(data: any) {
    console.log(data,'input received');
    if (data != undefined && data.col.length != 0) {
      this.all_data=data.data;
      this.keys = data.col;
      this.sourceData = data.data;
      this.gridChange(data.data);
      this.breadCrumbs = JSON.parse(localStorage.getItem('crumbs'));
      this.chref.detectChanges(); 
    }
  }
  change_data(files){
    console.log('change_data function');
    
    console.log(this.all_data);
    console.log(files);     
    this.gridChange(files.data);
    this.chref.detectChanges();
  }
ngOnChanges() {
    console.log('change');                  
  }
  getRead(b: any) {
    return b.Name;
  }

  checkType() {
    let flag = false;

    for (let obj of this.sourceData) {
      if (obj.file_extension != undefined) {
        flag = true;
      }
    };
    return flag;
  }
  EditFolderDetailsShow() {

  }
  @Input() users: any[];
  constructor(private chref: ChangeDetectorRef, private service: FileService, public dialog: MatDialog, private sanitizer: DomSanitizer, private msg: MessageService) {

    this.loadPermissionSet();

  }
  upload_new_file = false;
  edit_file = false;
  delete_file = false;
  download_file = false;
  share_file = false;
  public_link_file = false;

  loadPermissionSet() {
    if (localStorage.getItem('permissionArray') != null) {
      var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
      if (permissionArray.File) {
        console.log(permissionArray.File);
        permissionArray.File.forEach(permissions => {

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
          if (permissions.name == 'public_link_file') {
            this.public_link_file = true;
          }
        });
      }

    }

  }
  openDialog(popUpMsg: string): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: popUpMsg
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    this.close_popup();
  }
  EditFileDetails: boolean = false
  EditFileDetailsShow(row: any, type: number) {
    row.open = type;
    this.row = row;
    this.editFile.description = row.description;
    this.editFile.parent_id = row.id;
   // alert(row.id);
    this.editFile.title = row.title;
    this.editFile.name = row.name;
    this.EditFileDetails = true;
     setTimeout(()=>{      
        $("#EditFileDetails").css('display','block'); 
      $("#EditFileDetails").addClass('show');
      },200);
    

   // $("#EditFileDetails").addClass('display_blk');
    //$("#EditFileDetails").css('display','block'); 
    //this.hideShowPopUp('EditFileDetails'); 

  }
  EditFileDetailsHide() {
    $("#EditFileDetails").css('display','none');
      $("#EditFileDetails").removeClass('show');
      $("#EditFileDetails").removeClass('display_blk');
    this.EditFileDetails = false;
  }
  publicLink: boolean = false;
  row: any;
  link: string;
  close_popup(){
    //alert('d');
  $('body').removeClass('modal-open');
$('body').css('padding-right',0);
  $('.modal-backdrop').remove(); 
  }
  publicLinkDisplay(row: any, type: number) {
    this.copysuccess = '';
    console.log(row);
    if (row.id != undefined) {
      row.open = type;
      this.row = row;

      if (type == 1) {
        this.service.downloadFileURL(row.id).subscribe(
          (data: any) => {
            this.link = data;
          });
      }
      if (type == 2) {
        this.service.downloadFileURL(row.id).subscribe(
          (data: any) => {
            this.link = data.url;
          });
      }

    }
    this.publicLink = true;
  setTimeout(()=>{      
      $("#publicLink").css('display','block');
      $("#publicLink").addClass('show');
      },200);
   

  }
    publicLinkDisplayClose(row: any, type: number) {
     this.copysuccess = '';
     console.log(row);
   
     
     $("#publicLink").css('display','none');
     $("#publicLink").removeClass('show');
  $('body').removeClass('modal-open');
$('body').css('padding-right',0);
  $('.modal-backdrop').remove(); 
    this.publicLink = false;

  }
  hideShowPopUp(id){
     setTimeout(()=>{      
      $("#"+id).css('display','block');
      $("#"+id).addClass('show'); 
      },200);
    
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
  ngOnInit() {
    this.chref.detectChanges();
  }
  applyFilter(filterValue: string) {
    this._source.filter = filterValue.trim().toLowerCase();

    if (this._source.paginator) {
      this._source.paginator.firstPage();
    }
  }
  gridChange(val: any) {
    this._source = new MatTableDataSource(val);
    this._source.paginator = this.paginator;
    this._source.sort = this.sort;
  }
  selectFolder(id: number, name: string, breadIndex: number) {
    if (!breadIndex) {
      localStorage.setItem('fname', name)
    } else {
      this.breadCrumbs.splice(breadIndex + 1);
      localStorage.setItem('crumbs', JSON.stringify(this.breadCrumbs))
    }
    setTimeout(() => {
      this.msg.sendId(id)
    }, 0);
  }
  download(id: number, file_name: any, file_mime: any) {
    //this.service.downloadFileURL(id).subscribe(
    this.service.downloadSendFileURL(id).subscribe(
      (data: any) => {
        console.log(data);
        //window.open(data.url, "_blank");
        this.downloadFile(data, file_name, file_mime);
      }
    );

  }
  downloadFile(data: any, name, file_mime) {
    console.log(file_mime);
    console.log(name);
    const blob = new Blob([data], { type: file_mime });
    saveAs(blob, name);
  }

  updateFileProp() {
    if (this.checkType()) {
      this.service.updateFileProp(this.editFile, this.row.id).subscribe((data) => {
        this.openDialog(JSON.stringify(data));
        this.EditFileDetailsHide();
        this.updateGridValue.emit(0);
      });
    } else {
      //  console.log(this.row.id); 
      // this.editFile.parent_id=this.row.id;
      this.service.updateFolderProp(this.editFile, this.row.id).subscribe((data) => {
        this.openDialog(JSON.stringify(data));
        this.EditFileDetailsHide();
        this.updateGridValue.emit(2);
      });
    }
    this.updateGridValue.emit(true);
  }
  shareFile(row: any, type: number) {
    this.shareFileObj.file_id = row.id;
    this.service.shareFile(this.shareFileObj).subscribe((data) => {
      // console.log(JSON.stringify(data));
      this.publicLinkDisplayClose({}, row.open);
      this.shareFileObj = {
        file_id: undefined,
        share_to_ids: [],
        share_type: 0
      }
      this.openDialog(JSON.stringify(data));
       this.close_popup();
    });
  }
  openPreviewImage(row: any) {
    this.row = row;
    this.service.downloadFileURL(row.id).subscribe(
      (data: any) => {
        if (row.file_extension == 'xls' || row.file_extension == 'xlsx' 
          || row.file_extension == 'ppt' || row.file_extension == 'doc' || row.file_extension == 'docx') {
          this.dataUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/gview?url=" + data.url + "&embedded=true");
           this.previewImage = true;
             setTimeout(()=>{      
             $("#previewImage").css('display','block');
             $("#previewImage").addClass('show');
        },200);
        } else {
          this.dataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
          this.previewImage = true;
           setTimeout(()=>{      
           $("#previewImage").css('display','block');
           $("#previewImage").addClass('show');
      },200);
        }

      }
    );
    this.previewImage = true;;
  }
  closePreviewImage() {    
    $("#previewImage").css('display','none');
    $("#previewImage").removeClass('show');
    this.previewImage = false;
    this.dataUrl = undefined;
    this.uploadNewVersion = false;
    $("#uploadNewVersion").css('display','none');
    $("#uploadNewVersion").removeClass('show');

    this.close_popup();
  }
  uploadNewFile(file: any) {
    file = file[0];

    let form = new FormData();
    form.set("file_upload_new", file);
    this.service.versionUploadFile(this.row.id, form).subscribe(data => {
      this.uploadNewVersion = false;
      this.openDialog(JSON.stringify(data));
    }, (error) => {
      this.uploadNewVersion = false;
      this.openDialog(JSON.stringify(error.error));
    });
    ;
  }
  openUploadNewVersion(row: any) {
    this.uploadNewVersion = true;

    this.hideShowPopUp('uploadNewVersion');
    this.row = row;
  } 
}


