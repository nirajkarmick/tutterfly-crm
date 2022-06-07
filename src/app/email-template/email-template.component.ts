import { Component, OnInit, ViewEncapsulation, Input, ViewChild,ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatDialog, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { AdminServiceService } from '../service/admin-service.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { environment } from '../../environments/environment';
// import { QuilEditorComponent } from '../quil-editor/quil-editor.component';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css'],
  // directives: [QuilEditorComponent] 
})  
export class EmailTemplateComponent implements OnInit {
  // @ViewChild(QuilEditorComponent) quil:QuilEditorComponent;
  // @ViewChild('editor') childComponent: QuilEditorComponent;
  @ViewChild('editor') editorElementRef : ElementRef;
  serviceRef: Subscription;
  DATA_LinkInfo: any[];
  roles: any[];
  displayTable: boolean;
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort;
  displayedColumnsLinkInfo: string[];
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  newElement: any; 
  subjectSet=false;
  //editor 
  
   config: AngularEditorConfig = {
    editable: true,
    // spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
   // placeholder: "Enter text here...",
    placeholder: "",
    uploadUrl:environment.ip+"/rest_email_image_editor",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    sanitize: false,
    outline:false
  };
isLocal=true;
  //editor
  constructor(private service: AdminServiceService,
    public dialog: MatDialog) {
    this.fetchAllData();
       if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 || 
        location.hostname.search("tnt1")>=0 ||  location.hostname.search("dorjee")>=0
         ||  location.hostname.search("adrenotravel")>=0){ 
          this.isLocal=true;         
        }    

  } 
  setSubjectFocus(){
    this.subjectSet=true;
    console.log(this.subjectSet);
  }
  unSetSubjectFocus(){
    this.subjectSet=false;
    console.log(this.subjectSet);
  }
  onChange(vv){
    //console.log(vv.target); 
    console.log(this.newElement.body_html);
  }
  dtOptions: DataTables.Settings = {};
  ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            processing: true, 
          }; 
   // this.newElement.body_html="<h2>EDITOR</h2>";
  }
  getUserName(id){
    for(let user of this.all_users){
      console.log(user);
      if(user.id==id){ 
        return user.name; 
      }
    }
    return '';
  }
  emailTemplate: any;
  all_users=[];
  fetchAllData() { 
    this.serviceRef = this.service.getEmailTemplate().subscribe((data: any) => {
      this.DATA_LinkInfo = data.email_templates;
      this.emailTemplate = data.email_templates;
      this.all_users=data.all_users;
      this.displayedColumnsLinkInfo = ['sno', 'name', 'subject', 'body', 'created_at', 'action'];
      this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
      this.displayTable = true;

    });
  }
  modalAdd: boolean = false;
  AddNewShow(element: any) {
    //console.log(element);
    if (element) {
      this.newElement = element;
      // this.newElement=element.name;
      this.idUpdate = element.id;
     // this.newElement.type=element.published=='d'?'d':'h';
      //this.tempType();
      this.buttonLable = 'Save';
    } else {
      this.newElement = new Object;
      this.buttonLable = 'Add';
      this.newElement.body_html="";
    }
    this.modalAdd = true; 
     setTimeout(function () {
          $('.angular-editor-textarea').focus();
          console.log($('.angular-editor-textarea').html());
          // this.editorElementRef.nativeElement.focus();
     }, 500);

    // setTimeout(function () {
    //   $('.angular-editor .angular-editor-wrapper .angular-editor-textarea').css('height', '300px');
    //   console.log($('.angular-editor .angular-editor-wrapper .angular-editor-textarea').css('height'));
    // }, 500);

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

  decode_html(encodedString) {
    var tmpElement = document.createElement('span');
    tmpElement.innerHTML = encodedString;
    return tmpElement.innerHTML;
  }
  deleteEmailTemp(id) {
    var conf = confirm('Are you sure to delete email template ?');
    if (conf) {
      this.service.deleteEmailTemp(id).subscribe((data: any) => {
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
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
  create() {
    //this.newElement.body=this.newElement.body_html;
    console.log(this.newElement.body_html);  
  // if(this.newElement.type!='d'){
          this.newElement.body = this.newElement.body_html.replace(/&#(\d+);/g, function (match, number) {
           return String.fromCharCode(number);
            });
          this.newElement.body_html = this.newElement.body_html.replace(/&#(\d+);/g, function (match, number) {
           return String.fromCharCode(number);
            });      
    //}else{
    //  this.newElement.body = this.newElement.body_html; 
  //  }
    console.log(this.newElement); 
    if (this.buttonLable == 'Add') {
      this.service.saveEmailTemplate(this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData(); this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      }); 
    } else {
      this.service.updateEmailTemplate(this.idUpdate, this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData(); this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }
  buttonLable = 'Add';
  idUpdate: number;
  ngOnDestroy() {
    this.serviceRef.unsubscribe();
  }
  mod_name='';
  mod_data_name="";
   @ViewChild('tempText') tempText:ElementRef;
   @ViewChild('tempSubject') tempSubject:ElementRef;
   temp_type="";


  tempType(){
    if(this.newElement.type=='d'){
      this.temp_type='d';
    }else{
      this.temp_type='h';
    }
  }

  allModules=['Account','Contact','Lead','PersonalAccount','Supplier','Opportunity'];
  modulesData=[];
getModues(){
  this.modulesData=[];
      this.service.getTemplateAllColumnList(this.mod_name).subscribe((data: any) => {
        console.log(data);  
            this.modulesData=data.all_column;       
                 
      }); 
}
  getModues__(){
    this.modulesData=[];
      this.service.getAllColumnList(this.mod_name).subscribe((data: any) => {
        console.log(data); 
        if(this.mod_name=='Account'){
              this.modulesData=data.account_all_columns;
        }
        if(this.mod_name=='Contact'){
              this.modulesData=data.contact_all_columns;
        }
        if(this.mod_name=='Lead'){
              this.modulesData=data.lead_all_columns;
        }
        if(this.mod_name=='Supplier'){
              this.modulesData=data.account_all_columns;
        }

        if(this.mod_name=='PersonalAccount'){
              this.modulesData=data.personal_account_all_columns;
        }
        if(this.mod_name=='Opportunity'){
              this.modulesData=data.opportunity_all_columns;
        }
        
      }); 
  }
txtEditorPosition() {
console.log('focus');
} 
  insetModule(e){  
  var data_val=' ['+this.mod_name+'.'+this.mod_data_name+'] '; 
    if(this.subjectSet){

       console.log('set subject');
      var startPos=this.tempSubject.nativeElement.selectionStart; 
      this.tempSubject.nativeElement.value=this.tempSubject.nativeElement.value.substr(0,this.tempSubject.nativeElement.selectionStart)+data_val+this.tempSubject.nativeElement.value.substr(this.tempSubject.nativeElement.selectionStart,this.tempSubject.nativeElement.value.length);

      this.tempSubject.nativeElement.selectionStart=startPos; 

      this.newElement.subject=this.tempSubject.nativeElement.value;


    }else{
     
       var data_val=' ['+this.mod_name+'.'+this.mod_data_name+'] ';  
      var sel = window.getSelection();
      console.log(sel);
      for (var i = 0; i < sel.rangeCount; i++) {
        var $sNode = $(sel.getRangeAt(i).startContainer.parentNode);
        var $eNode = $(sel.getRangeAt(i).endContainer.parentNode);
        console.log(window.getSelection().baseNode.parentNode);
        console.log($sNode);
        console.log('9999'+$sNode.prop("class")+'0000');
        if ($sNode.prop("class") != "addNew-form-Subhead"  
         && $sNode.prop("class") != "col-md-6" 
         && $sNode.prop("class") != "col-md-12" 
         && $sNode.prop("class") != "form-group"
         && $sNode.prop("class") != "col-md-12 email_sub_wrapper"  
         && $sNode.prop("class") != "em_label"  && $sNode.prop("class") != "fas fa-edi"
           && $sNode.prop("class") != "semi-bold" && $sNode.prop("class") != "page-title"
            && $sNode.prop("class") != "angular-editor-button" 
            && $sNode.prop("class") != "simplebar-wrapper"
             && $sNode.prop("class") != "logo logo-light text-center"
          ){ 
          
            if (sel.getRangeAt && sel.rangeCount) {
                var range = sel.getRangeAt(0);
                console.log(range);
                range.insertNode(document.createTextNode(data_val)); 

                 const myRange2=range.cloneRange();
                 myRange2.collapse(false); // collapse the range to the end of selection
                 var g_html = document.createElement('span');
                 g_html.setAttribute("id", "edit_plc");
                 myRange2.insertNode(g_html);
                console.log(range.startContainer);
                 const last_range=myRange2.cloneRange();
                 last_range.collapse(false);
                 
                  
                  setTimeout(function () {
                       $("#edit_plc")[0].click();
                             $("#edit_plc").trigger('click');
                             $("#edit_plc").focus(); 
                             $('.angular-editor-placeholder').remove();                            
                             $("#edit_plc").remove(); 
                             alert($('.angular-editor-textarea').length);
                             var angular_editor_val=$('.angular-editor-textarea').html();
                             console.log(angular_editor_val); 
                             console.log(this.newElement.body_html); 
                     }, 200);

                // this.newElement.body_html=angular_editor_val;

          } 
        }
        if ($sNode.prop("class") == "angular-editor-wrapper show-placeholder"
         && $eNode.prop("class") == "angular-editor-wrapper show-placeholder"){
          
        }
    }

     
     
    } 
    this.getModues();
    //col-md-12 email_sub_wrapper
        // if (sel.getRangeAt && sel.rangeCount) {
        //     var range = sel.getRangeAt(0);
        //     console.log(range);
        //     range.insertNode(document.createTextNode(data_val));
        // }   


      // var startPos=this.tempText.nativeElement.selectionStart; 
      // this.tempText.nativeElement.value=this.tempText.nativeElement.value.substr(0,this.tempText.nativeElement.selectionStart)+data_val+this.tempText.nativeElement.value.substr(this.tempText.nativeElement.selectionStart,this.tempText.nativeElement.value.length);

      // this.tempText.nativeElement.selectionStart=startPos; 

      // this.newElement.body_html=this.tempText.nativeElement.value;

 

  }
}
