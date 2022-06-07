import { Component, OnInit } from '@angular/core';
import { ReportService } from '../service/report.service';
import { MessageService } from '../message.service';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  showGrid:boolean=false;
  folderName:string;
  gridData: any[];
  displayCol: any[];
  users: any[];
  selectedTab:string="Recent Reports";
  reportType:any;
  reportTypeList:any[];
  operatortList:any[];
  isFolder:boolean;
  breadCrumb=[];
  report_type:any;
report_type_id=0;
  popUpMsg: any = "";
  show_report=false;
  constructor(private router: Router,private service: ReportService,
    private msg :MessageService, public dialog: MatDialog,private route: ActivatedRoute) {
    this.msg.sendMessage("report-main"); 
      if (localStorage.getItem('modulesArray') != null) {
      var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
      console.log(modulesArray); 
        modulesArray.forEach(module => {
          if(module.custom_reports==true){
           this.show_report=true;
          } 
       });
      }
    if (this.show_report == false) { 
      this.popUpMsg = JSON.stringify('You are not Authorized to view this page!');
      this.openDialog(this.popUpMsg);
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);

    }
    let type =route.snapshot.queryParams['type'];
      this.report_type=type;
      if(type=='accounts'){
        this.report_type_id=2;
      }else if(type=='contacts'){
        this.report_type_id=3;
      }else if(type=='personal_accounts'){
        this.report_type_id=5;
      }else if(type=='leads'){
        this.report_type_id=4;
      }else if(type=='opportunities'){
        this.report_type_id=1;
      }else if(type=='supplier'){
        this.report_type_id=6;
      }else {
        this.report_type_id=0;
      }
      if(this.report_type_id==0){
         this.popUpMsg = JSON.stringify('Report not Found!');
      this.openDialog(this.popUpMsg);
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['report-main'] } }]);
      }else{
        
          localStorage.setItem("bc","[]");
          this.service.getMetaData().subscribe((data:any)=>{
          this.reportTypeList=data.reportable_types;
          if(this.reportTypeList && this.reportTypeList.length!=0){
              this.reportType=  JSON.stringify(this.reportTypeList[0]);
            }
          });
          this.inittalSetupData(); 
      }
   }
   openDialog(popUpMsg:any): void {
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

  newRepoPop: boolean = false;
  ngOnInit() { 
  }
  inittalSetupData(){
    this.gridData=[];
    this.displayCol=[];
    this.users=[];
    this.showGrid=true;
    this.changeTab(0);
  }  
  newRepoPopClose() {
    this.newRepoPop = false;
  }
  newRepoPopShow() {
    this.newRepoPop = true;
  }
  getRecentReport() {
    this.service.getIndexCall(this.report_type_id).subscribe((data: any) => {
      // console.log(JSON.stringify(data));
      this.gridData=data.reports;
      this.displayCol=data.report_columns;
      this.users=data.users;
      this.showGrid=true;
    });
  }
  getPrivateReport() {
    this.service.getPrivateReport(this.report_type_id).subscribe((data: any) => {
      // console.log(JSON.stringify(data));
      this.gridData=data.reports;
      // this.displayCol=data.report_columns;
      this.users=data.users;
      this.showGrid=true;
    });
  }
  getPublicReport() {
    this.service.getPublicReport(this.report_type_id).subscribe((data: any) => { 
      // console.log(JSON.stringify(data));
      this.gridData=data.reports;
      // this.displayCol=data.report_columns;
      this.users=data.users;
      this.showGrid=true;
    });
  }
  getFolderCreatedByMe() {
    this.service.getFolderCreatedByMe(this.report_type_id).subscribe((data: any) => {
      // console.log(JSON.stringify(data));
      this.gridData=data.folders;
      if(data.folders){
        this.displayCol= [{ name: "name", alias_name: "Name" }, { name: "created_by", alias_name: "Owner" }, { name: "updated_at", alias_name: "Last Modified Date" },
       //  { name: "id", alias_name: "Options" }
        ];;
      }
      this.users=data.users;
      this.showGrid=true;
    });
  }
  getAllFolder() {
    this.service.getAllFolder().subscribe((data: any) => {
      // console.log(JSON.stringify(data));
      this.gridData=data.folders;
      if(data.folders){
        this.displayCol= [{ name: "name", alias_name: "Name" }, { name: "created_by", alias_name: "Owner" },
         { name: "updated_at", alias_name: "Last Modified Date" }, 
       //  { name: "id", alias_name: "Options" }
         ];;
      }
      this.users=data.users;
      this.showGrid=true;
    });
  }
  getSharedByMeReport() {
    this.service.getSharedWithMe(this.report_type_id).subscribe((data: any) => {
      this.gridData=data.folders;
      if(data.folders){
        this.displayCol= [{ name: "name", alias_name: "Name" }, { name: "created_by", alias_name: "Owner" }, { name: "updated_at", alias_name: "Last Modified Date" },
        // { name: "id", alias_name: "Options" }
         ];;
      }
      this.users=data.users;
      this.showGrid=true;
    });
  }
  getCreatedByMeReport() {
    this.service.getCreatedByMeReport(this.report_type_id).subscribe((data: any) => {
      this.gridData=data.folders;
      if(data.folders){
        this.displayCol= [{ name: "name", alias_name: "Name" }, { name: "created_by", alias_name: "Owner" }, { name: "updated_at", alias_name: "Last Modified Date" },
         //{ name: "id", alias_name: "Options" }
         ];;
      }
      this.users=data.users;
      this.showGrid=true;
    });
  }
  changeTab(index:number){
    this.showGrid=false;
    this.breadCrumb=[];
    switch(index){
      case 0:
      this.isFolder=false;
      this.getRecentReport();
      this.selectedTab="Recent Reports"
      break;
      case 1:
      this.isFolder=false;
      this.getCreatedByMeReport();
      this.selectedTab="Created By Me Reports"
      break;
      case 2:
      this.isFolder=false;
      this.getPublicReport();
      this.selectedTab="Public Reports"
      break;
      case 3:
      this.isFolder=false;
      this.getPrivateReport();
      this.selectedTab="Private Reports"
      break;
      case 4:
      this.isFolder=false;
      this.getRecentReport();
      this.selectedTab="All Reports"
      break;
      case 5:
      this.isFolder=true;
      this.getAllFolder();
      this.selectedTab="All Folders"
      break;
      case 6:
      this.isFolder=true;
      this.getFolderCreatedByMe();
      this.selectedTab="Created By Me Folder"
      break;
      case 7:
      this.isFolder=true;
      this.getSharedByMeReport();
      this.selectedTab="Shared with Me"
      break;
    }
    if(this.isFolder){
      this.breadCrumb.push({id:-1,"Name":this.selectedTab,"index":index});
      localStorage.setItem("bc",JSON.stringify(this.breadCrumb));
    }
    
  }
  createReport(){
    this.newRepoPop=false;
    let data={"selectedTab":this.reportType,"operators":this.operatortList};
   
  }
  createFolder(){
          this.service.createFolder(undefined,this.folderName).subscribe((data:any)=>{
          this.openDialog(JSON.stringify( data ));
          this.folderName=null;
        });
    
  }
  changeBread(flag:boolean){
    if(flag){
      this.changeTab(this.breadCrumb[0].index)
    }
  }
}
