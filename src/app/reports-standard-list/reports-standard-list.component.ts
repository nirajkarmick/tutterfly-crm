import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login-service.service';
import { MessageService } from '../message.service';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from '../service/report.service';

@Component({
  selector: 'app-reports-standard-list',
  templateUrl: './reports-standard-list.component.html',
  styleUrls: ['./reports-standard-list.component.css']
})
export class ReportsStandardListComponent implements OnInit {

  constructor(
    private router: Router,private service: LoginServiceService, 
    private msg: MessageService,private dialog:MatDialog,
    private rService:ReportService,private route: ActivatedRoute) {
      let type =route.snapshot.queryParams['type'];
      this.msg.sendMessage("report-main"); 
     
      this.report_type=type;
      this.set_report_type(this.report_type);

}
set_report_type(type){
   if(type=='accounts'){
        this.report_type_id=2;
      }else if(type=='contacts'){
        this.report_type_id=3;
      }else if(type=='personal_accounts'){
        this.report_type_id=5;
       // this.report_type='Personal Account';
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
         this.openDialog();
         this.router.navigate(['/maindashboard', { outlets: { bodySection: ['report-main'] } }]);
      }else{
        this.renderData();
      }
}
raw_data=[1,2,3,4,5,6,7,8,9,10,11,12];
report_type:any;
report_type_id=0;
date_range_type='week';
popUpMsg: any = "";
oppChartreport=true;
totalData:any;
totalDataSearch:any;
totalCurrent=100;
totalCurrentSearch=20;
curr_page=2;
curr_page_search=2;
reportData:any;
st_report_lists:any;
  ngOnInit() {
  }
  get_report_list(type){
    this.report_type=type;
    this.set_report_type(type);     
  }
renderData(){ 

    this.rService.get_standard_report_list(this.report_type_id,).subscribe((data:any)=>{
    	console.log(data);
      this.reportData=data;      
      
      this.st_report_lists=data.st_report_lists;  
    });
  }
    openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
