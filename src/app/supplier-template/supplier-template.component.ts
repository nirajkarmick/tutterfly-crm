import { Component, ViewChild ,OnInit} from '@angular/core';
import { EmailEditorComponent } from 'angular-email-editor';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component'; 
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatDialog, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';

  
@Component({
  selector: 'app-supplier-template',
  templateUrl: './supplier-template.component.html',
  styleUrls: ['./supplier-template.component.css']
})
export class SupplierTemplateComponent implements OnInit {
  title = 'angular-email-editor';

  @ViewChild(EmailEditorComponent)
  private emailEditor: EmailEditorComponent;
  show_list=true;
  displayTable: boolean;
  constructor(private service: AdminServiceService,
    public dialog: MatDialog) { 
      this.fetchAllData();
  }
  ngOnInit() {
     setTimeout(() => { 
          $('.brand').remove();
        }, 11100);
  }
  editable_id=0;
  editableData:any;
  editForm(eData){
    this.editable_id=eData.id;
    this.editableData=eData;
    this.showForm=true; 
    this.template_name=this.editableData.name;
    this.template_subject=this.editableData.subject;
    this.template_html=this.editableData.body_html;
    this.template_json=this.editableData.body_json;
  }
   editorLoaded() {
    const json = JSON.parse(this.editableData.body_json); 
    console.log(json);
    this.emailEditor.loadDesign(json);
  }
  emailTemplate: any;
  fetchAllData() {
    console.log('fetch');
     this.showForm=false;
     this.editable_id=0;
    this.template_name='';
    this.template_subject='';
    this.template_html='';
    this.template_json='';
     this.service.getSupplieEmailTemplate().subscribe((data: any) => {
      this.emailTemplate = data.email_templates; 
      this.displayTable = true;

    });
  }
  template_json:any;
  template_html:any;
  template_subject="";
  template_name="";
 saveDesign() {
    let that=this;
    this.emailEditor.saveDesign((design:any) => { that.setJson(design)});
    this.emailEditor.exportHtml((data:any) => {that.setHtml(data.html)});
    
  } 
  setHtml(data){
   this.template_html=data;
   if(this.editable_id==0){
    this.createTemplate();

  }else{
    setTimeout(() => { 
           this.updateSupTemplate();
        }, 1100);
  }
  }
  setJson(data){
    this.template_json=data;
  } 
success_msg="";
updateSupTemplate(){ 
   var data={'id':this.editable_id,'name':this.template_name,'subject':this.template_name,
   'body_html':this.template_html,'body_json':this.template_json
 };
   console.log(data); 
   this.service.updateSupplierTemplate(data).subscribe((data: any) => {
        console.log(data.message) 
        this.success_msg='Template updated successfully';
        this.showForm=false;
        //this.popUpMsg =  'Template updated successfully';
        //this.openDialog();
        this.fetchAllData();
      }); 
}
remove_success_msg(){
  this.success_msg="";
}
createTemplate(){ 
   var data={'name':this.template_name,'subject':this.template_name,
   'body_html':this.template_html,'body_json':this.template_json
 };
   console.log(data); 
   this.service.saveSupplierTemplate(data).subscribe((data: any) => {
        console.log(data) 
        this.popUpMsg =  'Template added successfully';
        this.success_msg='Template added successfully';
        //this.openDialog();
        this.fetchAllData();
      }); 
} 
deleteEmailTemp(id){
    var conf = confirm('Are you sure to delete email template ?');
    if (conf) {
      var del_data={'id':id};
      this.service.deleteSuppEmailTemp(del_data).subscribe((data: any) => {
        this.fetchAllData();
        this.popUpMsg =  data.message;
        this.openDialog();
      }); 
    }

}
  exportHtml() {
  }
  showForm=false;
  showAddForm(){

    this.showForm=true;

  }
  popUpMsg: string;
   openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg) 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
