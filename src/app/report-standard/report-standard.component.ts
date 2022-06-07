import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login-service.service';
import { MessageService } from '../message.service';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from '../service/report.service';

@Component({
  selector: 'app-report-standard',
  templateUrl: './report-standard.component.html',
  styleUrls: ['./report-standard.component.css']
})
export class ReportStandardComponent implements OnInit {
report_type:any;
report_type_id=0;
date_range_type:any;
  popUpMsg: any = "";
  range_type:any;
  constructor(
    private router: Router,private service: LoginServiceService, 
    private msg: MessageService,private dialog:MatDialog,
    private rService:ReportService,private route: ActivatedRoute) {
      let type =route.snapshot.queryParams['type'];
      this.date_range_type =route.snapshot.queryParams['range_type'];
      this.msg.sendMessage("report-main"); 
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
      this.openDialog();
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['report-main'] } }]);
      }else{
      	this.renderData();
      }



  }
  oppChartreport=true;
   totalData:any;
  totalDataSearch:any;
  totalCurrent=100;
  totalCurrentSearch=20;
  curr_page=2;
  curr_page_search=2;
  reportData:any;
st_report_lists:any;
  reportList:any;
  reportName="";
  ngOnInit() {
  }
  get_report_name(){
    for(let list of this.st_report_lists){
      if(list.reportable_type_id==this.report_type_id && list.date_range_type==this.date_range_type){
        this.reportName=list.name;
      }
    }
  }

not_exported=true;
expoertedData:any; 
exportReport(){

   this.rService.showStandardReportData(this.report_type_id,this.curr_page,this.date_range_type,true).subscribe((data:any)=>{
      
      this.expoertedData=data;
     this.exportReportToCsv();     
    });
}
    exportReportToCsv() {
      this.not_exported=false;


            var filename=this.reportName.replace(/ /g,"_")+'.csv';
            var rows=this.expoertedData.report_results;
            console.log(this.expoertedData.report_results.length);
            if(this.expoertedData.report_results.length==0){
              this.not_exported=true;
               this.popUpMsg = JSON.stringify('No Data Found!');
               this.openDialog();
              //return false;
            }
            else{
              
                var rowRes=[[]];
                let i=0;
                for(let rep of this.expoertedData.report_results){ 
                  //console.log(rep);
                  var keys = Object.keys(rep);
                  let j=0;
                  rowRes[i+1]=[];
                  let that=this;
                  var col_val:any;
                  rowRes[0]=[];
                  keys.forEach(function(key){
                    for(let col of that.expoertedData.display_columns){          
                      if(col.name==key){
                            rowRes[0].push(col.alias_name);
                            let c_type=that.isEmptyObject(rep[key]);

                            if(c_type=='s'){
                              col_val=rep[key];
                            }else if(c_type=='o'){
                               col_val=rep[key].name;
                            }else if(c_type=='a'){
                               let k=0;
                               col_val='';
                               for(let arr of rep[key]){
                                  if(rep[key].length ==0){
                                     col_val+=arr['name'];
                                  }else{
                                      col_val+=arr['name']+',';
                                  }                 
                                  
                                  k++;
                               }
                            }
                            rowRes[i+1].push(col_val);
                      }
                    }
                                
                    
                    j++;
                });
                  i++;
                }
                 setTimeout(() => {
                   this.not_exported=true;
               }, 5300);
                var dte = new Date();
                var cp_year = dte.getFullYear();
                let footer_text1="Copyright "+cp_year+" TutterflyCRM";
                let footer_text2="All rights reserved.";
                 rowRes[i+1]=[];
                 rowRes[i+2]=[];
                 rowRes[i+3]=[];
                 rowRes[i+1].push('');
                 rowRes[i+2].push(footer_text1);
                 rowRes[i+3].push(footer_text2);
                //console.log(rowRes); 
               rows=rowRes;
               // return false;
                    var processRow = function (row) {
                        var finalVal = '';
                        for (var j = 0; j < row.length; j++) {
                            var innerValue = row[j] === null ? '' : row[j].toString();
                            if (row[j] instanceof Date) {
                                innerValue = row[j].toLocaleString();
                            };
                            var result = innerValue.replace(/"/g, '""');
                            if (result.search(/("|,|\n)/g) >= 0)
                                result = '"' + result + '"';
                            if (j > 0)
                                finalVal += ',';
                            finalVal += result;
                        }
                        return finalVal + '\n';
                    };

                    var csvFile = '';
                    for (var ii = 0; ii < rows.length; ii++) {
                        csvFile += processRow(rows[ii]);
                        console.log(csvFile);
                    }

                    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
                    if (navigator.msSaveBlob) { // IE 10+
                        navigator.msSaveBlob(blob, filename);
                    } else {
                        var link = document.createElement("a");
                        if (link.download !== undefined) { // feature detection
                            // Browsers that support HTML5 download attribute
                            var url = URL.createObjectURL(blob);
                            console.log(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", filename);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    }
                }

    }
renderData(){

    this.rService.get_standard_report_list(this.report_type_id,).subscribe((data:any)=>{
      console.log(data);
      this.reportList=data;  
      this.st_report_lists=data.st_report_lists;
      if(this.st_report_lists){
        this.get_report_name();
      }  
    });

    this.rService.showStandardReportData(this.report_type_id,0,this.date_range_type).subscribe((data:any)=>{
    	console.log(data);
      this.reportData=data;
      this.totalData=data.total;
      this.totalCurrent=100;
      this.curr_page=2;        
      
    });
  }
  get_report(date_range_type){
  	this.date_range_type=date_range_type;
  	this.renderData();

  }
  onScroll(evnt){
   console.log(evnt.target.scrollTop);
  console.log(this.totalCurrent,this.totalData);
  if(evnt.target.scrollTop > evnt.target.scrollHeight-602){
    console.log('reach last');
  }
  if(evnt.target.scrollTop > evnt.target.scrollHeight-602  && this.totalCurrent < this.totalData){
    
      this.loadMoreData();
  }
}

  loadMoreData(){ 
   let report_data=this.reportData.report_results;
   this.rService.showStandardReportData(this.report_type_id,this.curr_page,this.date_range_type).subscribe((data:any)=>{
     this.setPaginationData(data);     
    });
} 
setPaginationData(data){
           var a_data=data; 
           var acc_data=a_data.report_results;
           let that=this;
           Object.keys(acc_data).map(function(key) {
                 that.reportData.report_results.push(acc_data[key]);
            });              
           this.totalCurrent=this.reportData.report_results.length; 
             
           this.curr_page=parseInt(a_data.pagination.current_page) + 1; 

}
   getKeys(data:any){
      let a = 
      this.reportData.display_columns.map((obj:any)=>{return obj.name});

      return a;
    }
  title:string;
  navigate(key:string,obj:any){
  	console.log(key); console.log(obj);
     var link = '';
    if(key=='title'){
       link='maindashboard/(bodySection:fileDetails)?id='+obj.id;
    //  this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['fileDetails'] }}],{queryParams:{ 'id': obj.id}});
    }
    if((key=='last_name' || key=='first_name') && this.report_type=='contacts'){
       link='maindashboard/(bodySection:contactDetails)?id='+obj.id;
     // this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['contactDetails'] }}],{queryParams:{ 'id': obj.id}});
    }
    if((key=='last_name' || key=='first_name') && this.report_type=='personal_accounts'){
       link='maindashboard/(bodySection:personelDetails)?id='+obj.id;
     // this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['personelDetails'] }}],{queryParams:{ 'id': obj.id}});
    }
    if((key=='last_name' || key=='first_name') && this.report_type=='leads'){
       link='maindashboard/(bodySection:leaderDetails)?id='+obj.id;
     // this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['leaderDetails'] }}],{queryParams:{ 'id': obj.id}});
    }
    if(key=='name' && this.report_type=='accounts'){
       link='maindashboard/(bodySection:clientDetails)?id='+obj.id;
    //  this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['clientDetails'] }}],{queryParams:{ 'id': obj.id}});
    } 
    if(key=='name' && this.report_type=='opportunities'){
       link='maindashboard/(bodySection:oppoDetails)?id='+obj.id;
      //this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['oppoDetails'] }}],{queryParams:{ 'id': obj.id}});
    }

     // var link='itineraryMain/(itinerarySection:itinerary-builder)?id='+id;
       this.router.navigate([]).then(result => {  window.open(link, '_blank'); });
  }

  isEmptyObject(obj) {
      var isArray=false;
      var objType='s';
       isArray = Array.isArray(obj);
      if(isArray){
        return objType='a';
      }else{
          if(obj && typeof obj === 'object'){
            return objType='o';
            } 
      }
       return objType='s';
}


  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg)
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
    showChartReport() {
        this.oppChartreport = false;
    }
    hideChartReport() {
        this.oppChartreport = true;
    }
}
