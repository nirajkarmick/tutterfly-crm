import { Component, OnInit, ViewEncapsulation, Input, ViewChild  } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { Subscription } from 'rxjs';
import { AdminServiceService } from '../service/admin-service.service';

@Component({
  selector: 'app-doc-header-footer',
  templateUrl: './doc-header-footer.component.html',
  styleUrls: ['./doc-header-footer.component.css']
})
export class DocHeaderFooterComponent implements OnInit {
serviceRef:Subscription;
DATA_LinkInfo: any[];
roles:any[];
displayTable:boolean;
@ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
@ViewChild(MatSort) sortLinkInfo: MatSort;
displayedColumnsLinkInfo: string[] ;
dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
newElement:any;
active_checked=true;
constructor(private service:AdminServiceService) { 
  this.fetchAllData();
 }
 ngOnInit() {
 }
 active(){
  if(this.newElement.active==1){
      this.newElement.active==0;
      this.active_checked=false;
  }else{
      this.newElement.active==1;
      this.active_checked=true;
  }
 }
 template_type=[];
 fetchAllData(){
  this.serviceRef= this.service.getDocHeaderFooters().subscribe((data:any)=>{
  	console.log(data);
    this.DATA_LinkInfo=data.header_footers;
    this.template_type=data.type;
    this.displayedColumnsLinkInfo  = ['sno','name','footer_content_html','active','created_at','updated_at','action'];
    this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
    this.displayTable=true;
  });
 }
 modalAdd:boolean=false;
 AddNewShow(element:any){
  if(element){
    this.newElement=element;
    // this.newElement=element.name;
    this.idUpdate=element.id;
    this.buttonLable='Save';
    this.titleLable='Edit';
   }else{
    this.newElement=new Object;
    this.newElement.footer_content_html='';
    this.newElement.header_content_html='';
    this.newElement.single_active=0;
    this.active_checked=false;
    this.buttonLable='Add';
    this.titleLable='Add';
   }
   this.modalAdd=true;
 }
 AddNewHide(){
   this.modalAdd=false;
 }
onHtmlChange(html){
  this.newElement.footer_content_html=html;
  console.log(this.newElement.footer_content_html);
}
 modalEdit:boolean=false;
 modalEditShow(){
   this.modalEdit=true;
 }
 modalEditHide(){
   this.modalEdit=false;
 }


 create(){
  if(this.buttonLable=='Add'){
    console.log(this.newElement);
    this.service.saveHeaderFooter(this.newElement).subscribe((data:any )=>{
      console.log(data)
      this.AddNewHide();
      this.fetchAllData();
    });
  }else{
    this.service.updateHeaderFooter(this.idUpdate,this.newElement).subscribe((data:any )=>{
      console.log(data)
      this.AddNewHide();
      this.fetchAllData();
    });
 }
}
 buttonLable='Add';
 titleLable='Add';
 idUpdate:number;
 ngOnDestroy(){
   this.serviceRef.unsubscribe();
 }

}
