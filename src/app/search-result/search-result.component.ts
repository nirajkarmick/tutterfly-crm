import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../service/login-service.service';
import { MessageService } from '../message.service';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportService } from '../service/report.service';
import {Location} from '@angular/common';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  private chart: AmChart;
  options: any = {};
  data: any;
  reportData:any;
  title:string;
  display:any[];
  additional_display:any[];
  groupList:string[];
  reportId:any;
  pix:number=0;
  report_id:any;
  constructor(private AmCharts: AmChartsService,
    private router: Router,private service: LoginServiceService, 
    private msg: MessageService,private dialog:MatDialog,private _location: Location,
    private rService:ReportService,private route: ActivatedRoute) {
      let id =route.snapshot.queryParams['id'];
    this.report_id=id; 
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 || 
      location.hostname.search("tnt1")>=0 ||  location.hostname.search("prashtest")>=0
       ||  location.hostname.search("adrenotravel")>=0){ 
        this.isLocalSet=true;       
      } 
    if(id!=undefined){
      this.reportId={'id':id};
      this.loadChartPie();
        this.fetchReportData(id);
    }else{
        this.msg.getId().subscribe(data => {
          if (data.search_module_id != undefined) {
            this.searchData();
          }
        });
    }
    this.msg.sendMessage("report");
     
  }
  loadChartPie(){

  //   this.options = {
  //   "type": "pie",
  //   "theme": "none",
  //   "innerRadius": "40%",
  //   "gradientRatio": [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, 0, 0.1, 0.2, 0.1, 0, -0.2, -0.5],  
  //   "balloonText": "fdsfdsfsd",
  //   "valueField": "count",
  //   "titleField": "group_by",
  //   "balloon": {
  //       "drop": true,
  //       "adjustBorderColor": false,
  //       "color": "#FFFFFF",
  //       "fontSize": 16
  //   },
  //   "export": {
  //       "enabled": true
  //   }
  // } 
  this.options={
          "type": "pie",
          "theme": "none", 
          "labelText": "[[group_by]]: [[count]]",
          "balloonText": "[[group_by]]: [[count]]",
          "titleField": "group_by",
          "valueField": "count",
          "outlineColor": "#FFFFFF",
          "outlineAlpha": 0.8,
          "outlineThickness": 2,
          "colorField": "color",
          "pulledField": "pulled",
          "titles": [{
            "text": ""
          }],
          // "listeners": [{
          //   "event": "clickSlice", 
          //   "method": function(event) {
          //     console.log('dfdsfs');
          //     var chart = event.chart;
          //     let that=this;
          //     if (event.dataItem.dataContext.id != undefined) {
          //       selected = event.dataItem.dataContext.id;
          //     } else {
          //       selected = undefined;
          //     }
          //     chart.dataProvider = that.showGraphDiv();
          //     chart.validateData();
          //   }
          // }],
          "export": {
            "enabled": true
          }
        }
  }

lineOptions: any = {};
funnelOptions: any = {};
  loadChartLine(){
  
  this.lineOptions={
        "theme": "none",
        "type": "serial",
      "startDuration": 2, 
        "valueAxes": [{
            "position": "left",
            "title": "Count"
        }],
        "graphs": [{
            "balloonText": "[[category]]: <b>[[value]]</b>",
            "fillColorsField": "color",
            "fillAlphas": 1,
            "lineAlpha": 0.1,
            "type": "column",
            "valueField": "count"
        }],
        "depth3D": 20,
      "angle": 30,
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "group_by",
        "categoryAxis": {
            "gridPosition": "start",
            "labelRotation": 90
        },
        "export": {
          "enabled": true
         }

};
  
  }
  loadFunnelchart(){
  
  this.funnelOptions={
  "type": "funnel",
  "theme": "none", 
  "titleField": "group_by",
  "marginRight": 160,
  "marginLeft": 15,
  "labelPosition": "right",
  "funnelAlpha": 0.9,
  "valueField": "count",
  "startX": 0,
  "neckWidth": "40%",
  "startAlpha": 0,
  "outlineThickness": 1,
  "neckHeight": "30%",
  "balloonText": "[[group_by]]:<b>[[count]]</b>",
  "export": {
    "enabled": true
  }
} ;
  
  }
   backClicked() {
    this._location.back();
  }
  popUpMsg="";
  openDialog(popUpMsg: string): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: popUpMsg
    });
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['Dashboard'] }}]);
    });
  }
 
  ngOnInit() {
    if(this.data==undefined && this.route.snapshot.queryParams['id']==undefined){
      let query = JSON.parse(localStorage.getItem('search'));
      if(query && query.search_data){
         this.searchData()
      }
    }
  }
  checkForJson(str:any){
    if(str!=null && str.name != undefined && str.name != null){
      str=str.name;
    }
    return str;
  }
  totalData:any;
  totalDataSearch:any;
  totalCurrent=100;
  totalCurrentSearch=20;
  curr_page=2;
  curr_page_search=2;
  report_type=""; 
  groupResults=[];
  isLocalSet=true;
  fetchReportData(id:number){  
    this.rService.showReportData(id).subscribe((data:any)=>{
      this.reportData=data;
      this.totalData=data.total;
      this.totalCurrent=100;
      this.curr_page=2; 
     this.report_type=data && data.reportable_type?data.reportable_type.name:'opportunities';
 
      if(Array.isArray(this.reportData.report_results)){
        console.log(this.reportData.report_results);
        
      }else{
        var all_group_key=[];
        this.groupList=  Object.keys(this.reportData.report_results); 
        var total_count=0; 
        for(let res in this.reportData.report_results){
           console.log(res); 
          for(let rep of this.reportData.report_results[res]){            
            total_count++; 
          } 
        }
        this.totalData=total_count; 
      }

    
    });
  }

  destroyGraph() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

  showGraph=false;
  hideGraphPie(){
    this.showGraph=false;

  }
  showGraphPie(){
   // this.destroyGraph();
    this.showGraph=true;
    this.loadChartPie();
    if(this.showGraph){
        this.options.dataProvider=[];
        for(let res in this.reportData.report_results){
           console.log(res);
           var group_count=0;
          for(let rep of this.reportData.report_results[res]){   
            group_count++;
          }
          this.options.dataProvider.push({'group_by':res,'count':group_count});
         
      }
    }
       

  }
  showGraphLine(){ 
    this.showGraph=true;
    this.loadChartLine();
    if(this.showGraph){
        this.lineOptions.dataProvider=[];
        for(let res in this.reportData.report_results){
           console.log(res);
           var group_count=0;
          for(let rep of this.reportData.report_results[res]){   
            group_count++;
          }

          this.lineOptions.dataProvider.push({'group_by':res,'count':group_count,"color": this.getRandomColor()});
         
      }
    }      

  } 

  showGraphFunnel(){ 
    this.showGraph=true;
    this.loadFunnelchart();
    if(this.showGraph){
        this.funnelOptions.dataProvider=[];
        for(let res in this.reportData.report_results){
           console.log(res);
           var group_count=0;
          for(let rep of this.reportData.report_results[res]){   
            group_count++;
          }

          this.funnelOptions.dataProvider.push({'group_by':res,'count':group_count,"color": this.getRandomColor()});
         
      }
    }      

  }

  getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
  loadMoreData(){ 
   let report_data=this.reportData.report_results;
   this.rService.showReportData(this.report_id,this.curr_page).subscribe((data:any)=>{
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
onScroll(evnt){
 // console.log(evnt.target.scrollTop);
  //console.log(this.totalCurrent,this.totalData);
   
  if(evnt.target.scrollTop > evnt.target.scrollHeight-602){
    console.log('reach last');
  }
  if(evnt.target.scrollTop > evnt.target.scrollHeight-602  && this.totalCurrent < this.totalData){
    
      this.loadMoreData();
  }
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

not_exported=true;
expoertedData:any; 
exportRawData=[];
exportRawDataTotal=0;
exportDataTotal=0;
exportResPerPage=150;  
exportNoOfPage=1;   
dataExportPush=[];
export_loader=false;
exportReport(){    
this.exportRawData=[];
this.exportDataTotal=0;
this.dataExportPush=[];
this.export_loader=true;
   this.rService.ExportReportData(this.report_id).subscribe((data:any)=>{      
      this.expoertedData=data;
      //console.log(data);
      this.exportRawData=data.report_results;
      if(this.exportRawData && this.exportRawData.length>0){
         this.exportDataTotal=this.exportRawData.length;
         this.exportNoOfPage=Math.ceil(this.exportDataTotal / this.exportResPerPage);
        var dd=this.splitUp(this.exportRawData,this.exportNoOfPage);
        if(dd && dd.length>0){
          let jj=0;
          let k=0;
          var exp_resp=false;
          for(let dta of dd){  
            let that=this;
                (function(){ 
                var y = Math.floor((Math.random() * 1000) + 1500); 
                console.log(y);
                var timer=y*(k)+1500;   
                   setTimeout( function(){                                  
                    console.log(timer+" seconds");
                    var exp_resp=that.formatCsvDataApi(dta,jj+1,dd.length); 
                     jj++;
                  }, timer );
                })();
        
                  k++;
          }
        }
        console.log(dd);
       // this.formatCsvDataApi();
      }
       console.log(this.exportNoOfPage);    
    });
}
splitUp(arr, n) {
    var rest = arr.length % n, // how much to divide
        restUsed = rest, // to keep track of the division over the elements
        partLength = Math.floor(arr.length / n),
        result = [];

    for(var i = 0; i < arr.length; i += partLength) {
        var end = partLength + i,
            add = false;

        if(rest !== 0 && restUsed) { // should add one element for the division
            end++;
            restUsed--; // we've used one division element now
            add = true;
        }

        result.push(arr.slice(i, end)); // part of the array

        if(add) {
            i++; // also increment i in the case we added an extra element for division
        }
    }

    return result;
}
err_cnt=0
formatCsvDataApi(report_data,cnt,total){   
   this.rService.FormatReportData(report_data,this.report_type).subscribe((data:any)=>{
 
      this.dataExportPush= this.dataExportPush.concat(data.report_results);
      console.log(this.dataExportPush); 
      console.log(this.exportDataTotal,this.dataExportPush.length); 
      if(this.exportDataTotal==this.dataExportPush.length){
         this.exportReportToCsv();
      }
      //return true;    
    },(error)=>{
      this.err_cnt++;
          if(this.err_cnt==1){
                   this.export_loader=false;
                   this.popUpMsg=JSON.stringify('Unable to export data! Try again');
                   this.openDialog(this.popUpMsg);

          } 
    }); 

}
  exportReportToCsv() {
         this.export_loader=false;

            var filename=this.expoertedData.report_details.name.replace(/ /g,"_")+'.csv';
            var rows=this.dataExportPush;
            console.log(this.dataExportPush);
            if(this.dataExportPush.length==0){
              this.openDialog(JSON.stringify('No Data Found!'));
              //return false;
            }
            else{
                var rowRes=[[]];
                let i=0;
                for(let rep of this.dataExportPush){
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
                    for(let col of that.expoertedData.add_display_columns){          
                      if(col.name==key){
                            rowRes[0].push(col.alias_name);
                            let c_type=that.isEmptyObject(rep[key]);

                            if(c_type=='s'){
                              col_val=rep[key];
                            }else if(c_type=='o'){
                               col_val=rep[key];
                            }else if(c_type=='a'){
                               let k=0;
                               col_val='';
                               for(let arr of rep[key]){
                                  if(rep[key].length ==0){
                                     col_val+=arr;
                                  }else{
                                      col_val+=arr+',';
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
                var dte = new Date();
                var cp_year = dte.getFullYear();
                let footer_text1="Copyright "+cp_year+" TutterflyCRM";
                let footer_text2="All rights reserved.";
                 rowRes[i+1]=[];
                 rowRes[i+2]=[];
                 rowRes[i+3]=[];
                 rowRes[i+4]=[];
                 rowRes[i+5]=[];
                 rowRes[i+4].push(footer_text1);
                 rowRes[i+5].push(footer_text2); 
               rows=rowRes; 
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
    
   search_module_id:any; 
  searchData(){

        let query = JSON.parse(localStorage.getItem('search'));
      console.log(query);
      this.search_module_id=query.search_module_id;
      if(query && query.search_module_id==2){
        this.msg.sendMessage("acc");
      }
       if(query && query.search_module_id==3){
        this.msg.sendMessage("contact");
      }
       if(query && query.search_module_id==4){
        this.msg.sendMessage("file");
      }
       if(query && query.search_module_id==5){
        this.msg.sendMessage("lead");
      }
       if(query && query.search_module_id==6){
        this.msg.sendMessage("oppo");
      }
       if(query && query.search_module_id==7){
        this.msg.sendMessage("person");
      }
       if(query && query.search_module_id==8){
        this.msg.sendMessage("report");
      }
       if(query && query.search_module_id==9){
        this.msg.sendMessage("supp");
      }
          this.service.searchResults(query).subscribe((data: any) => {
            if(data!=null){
                if(!data.error){
                  this.title=data.search_module.name;
                  this.data=data.search_results;
                  this.display=data.display_columns;
                  this.curr_page_search=2;
                  this.totalDataSearch=data.total;
                  this.totalCurrentSearch=20;
                }else{
                  this.dialog.open(data);
                }
            }else{
            this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['Dashboard'] }}]);
            }
          },err=>{
            this.openDialog(JSON.stringify(err.error));
          },()=>{
          })
  }

   loadMoreDataSearch(){ 
  let query = JSON.parse(localStorage.getItem('search'));
  query.page=this.curr_page_search;
   this.service.searchResults(query).subscribe((data: any) => {
            this.setPaginationDataSearch(data);
          },err=>{
            this.openDialog(JSON.stringify(err.error));
          },()=>{
          })
} 
setPaginationDataSearch(data){
           var a_data=data; 
           var acc_data=a_data.search_results;
           let that=this;
           Object.keys(acc_data).map(function(key) {
                 that.data.push(acc_data[key]);
            });              
           this.totalCurrentSearch=this.data.length; 
             
           this.curr_page_search=parseInt(a_data.pagination.current_page) + 1; 

}
    getKeys(data:any){
      let a = 
      this.reportData.display_columns.map((obj:any)=>{return obj.name});

      return a;
    }
   getKeysAdd(data:any){
    if(this.reportData.add_display_columns && this.reportData.add_display_columns.length>0){
      
      let a = 
      this.reportData.add_display_columns.map((obj:any)=>{return obj.name});

      return a;
    }
    }
  navigate(key:string,obj:any){
    var url=''; 
    var app_link="/app"; 
    if (location.hostname.search("192.168")>=0  ||
      location.hostname.search("localh")>=0){ 
         app_link="";   
    } 
    if(key=='title'){
      var url = this.router.serializeUrl(  this.router.createUrlTree([app_link+'/maindashboard',{ outlets: { bodySection: ['fileDetails'] }}],{queryParams:{ 'id': obj.id}}));
    }
    if((key=='last_name' && this.title=='Contacts') || (key=='record_id' && this.title=='Contacts')){
      var url = this.router.serializeUrl(  this.router.createUrlTree([app_link+'/maindashboard',{ outlets: { bodySection: ['contactDetails'] }}],{queryParams:{ 'id': obj.id}}));
    }
    if((key=='last_name' && this.title=='Person Accounts') || (key=='first_name' && this.title=='Person Accounts') || (key=='record_id' && this.title=='Person Accounts')){
       var url = this.router.serializeUrl( this.router.createUrlTree([app_link+'/maindashboard',{ outlets: { bodySection: ['personelDetails'] }}],{queryParams:{ 'id': obj.id}}));
    }
    if((key=='last_name' && this.title=='Leads') || (key=='first_name' && this.title=='Leads') || (key=='record_id' && this.title=='Leads')){
      var url = this.router.serializeUrl(  this.router.createUrlTree([app_link+'/maindashboard',{ outlets: { bodySection: ['leaderDetails'] }}],{queryParams:{ 'id': obj.id}}));
    }
    if((key=='name' && this.title=='Accounts') || (key=='record_id' && this.title=='Accounts')){
      var url = this.router.serializeUrl(  this.router.createUrlTree([app_link+'/maindashboard',{ outlets: { bodySection: ['clientDetails'] }}],{queryParams:{ 'id': obj.id}}));
    } 
    if((key=='name' && this.title=='Opportunities') || (key=='record_id' && this.title=='Opportunities')){
      var url = this.router.serializeUrl(  this.router.createUrlTree([app_link+'/maindashboard',{ outlets: { bodySection: ['oppoDetails'] }}],{queryParams:{ 'id': obj.id}}));
    }
    if((key=='name' && this.title=='Suppliers') || (key=='record_id' && this.title=='Suppliers')){
       var url = this.router.serializeUrl( this.router.createUrlTree([app_link+'/maindashboard',{ outlets: { bodySection: ['supplier-details'] }}],{queryParams:{ 'id': obj.id}}));
    }
    if(url){
     window.open(url, '_blank');
    }
  }

  navigate__(key:string,obj:any){
    if(key=='title'){
      const link =  this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['fileDetails'] }}],{queryParams:{ 'id': obj.id}});
    }
    if((key=='last_name' && this.title=='Contacts') || (key=='record_id' && this.title=='Contacts')){
      const link =  this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['contactDetails'] }}],{queryParams:{ 'id': obj.id}});
    }
    if((key=='last_name' && this.title=='Person Accounts') || (key=='first_name' && this.title=='Person Accounts') || (key=='record_id' && this.title=='Person Accounts')){
       const link = this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['personelDetails'] }}],{queryParams:{ 'id': obj.id}});
    }
    if((key=='last_name' && this.title=='Leads') || (key=='first_name' && this.title=='Leads') || (key=='record_id' && this.title=='Leads')){
      const link =  this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['leaderDetails'] }}],{queryParams:{ 'id': obj.id}});
    }
    if((key=='name' && this.title=='Accounts') || (key=='record_id' && this.title=='Accounts')){
      const link =  this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['clientDetails'] }}],{queryParams:{ 'id': obj.id}});
    } 
    if((key=='name' && this.title=='Opportunities') || (key=='record_id' && this.title=='Opportunities')){
      const link =  this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['oppoDetails'] }}],{queryParams:{ 'id': obj.id}});
    }
    if((key=='name' && this.title=='Suppliers') || (key=='record_id' && this.title=='Suppliers')){
       const link = this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['supplier-details'] }}],{queryParams:{ 'id': obj.id}});
    }
     //window.open(link, '_blank');
  }
  editReport(){
      
  }

  checkForDate(val){
    return val;
  }
}
