import { Component, OnInit, OnDestroy } from '@angular/core';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { MessageService } from '../message.service';
//import {  MatProgressSpinnerModule} from '@angular/material';
//import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DashboardService } from '../service/dashboard.service';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private chart: AmChart;
  options: any = {};
  keyDeals: any;
  todayTask: any;
  pendingTask:any;
  todayPayment: any;
  recent: any[];
  targetValue: number;
  userFeed: any;
  userFeedlen: any;
  isAdded: any;
  current = 0;
  links = [];
  public spinkit = Spinkit;
  graph_loader = false;
  activity_loader = false;
  target_graph=true;
  closed_won_graph=false;
  constructor(private AmCharts: AmChartsService, private msg: MessageService, 
    private service: DashboardService) {
    this.msg.sendMessage(undefined);

    this.getGraphData();
    this.refreshUserFeed();
    //window.location.reload(true); 
  }
  close_value(evt) {
    if (evt.target.id == "dash_valueBox") {
      console.log('dd2');
    } else {
      console.log('ee2');
    }
    //For descendants of menu_content being clicked, remove this check if you do not want to put constraint on descendants.
    if ($(evt.target).closest('#dash_valueBox').length) {
      console.log('pp2');
    } else {
      console.log('qq2');
      this.valueBoxHide();
    }
  }
  getClosedWonGraph(){
    this.target_graph=false;
    this.closed_won_graph=true;
    this.loadChartLine();
  }
    loadChartLine(){
  
 
  
  }
  getTargetGraph(){
    this.target_graph=true;
    this.closed_won_graph=false;
  }
  vData:any;
  lineOptions: any = {};
  getGraphData() {
    this.ngOnInit();
    this.graph_loader = true;
    // this.service.getBlade_v().subscribe((vdata: any) => { 
    //   this.vData=vdata.body;
    //   console.log(vdata,'vvvvv');
    // }, error => { 

    // });
    this.service.graphData().subscribe((data: any) => {
      this.options.dataProvider = data.monthly_target;
      this.targetValue = this.options.dataProvider[0].target_amount;
      this.keyDeals = data.key_deals;
      if (data.todays_tasks.length) {
        for (let i = 0; i < data.todays_tasks.length; i++) {
          var tsk_type = data.todays_tasks[i].taskable_type;
          tsk_type = tsk_type.split('\\');
          var link = this.createUserActivityLink(tsk_type[2]);
          data.todays_tasks[i].taskable_link = link;
        }
      }
      this.todayTask = data.todays_tasks;
      if (data.pending_tasks.length) {
        for (let i = 0; i < data.pending_tasks.length; i++) {
          var tsk_type = data.pending_tasks[i].taskable_type;
          tsk_type = tsk_type.split('\\');
          var link = this.createUserActivityLink(tsk_type[2]);
          data.pending_tasks[i].taskable_link = link;
        }
      }

      this.pendingTask = data.pending_tasks;
      this.todayPayment = data.opp_today_payments;
      console.log(data.opp_today_payments);
      console.log(this.todayPayment);
      this.recent = data.recent_records;
      this.graph_loader = false;

       this.lineOptions.dataProvider=[];
       this.lineOptions.dataProvider.push({'group_by':'Account Closed','amount':this.options.dataProvider[0].target_account_amount,"color": this.getRandomColor()});
       this.lineOptions.dataProvider.push({'group_by':'Person Account Closed','amount':this.options.dataProvider[0].target_personal_account_amount,"color": this.getRandomColor()});
         
    }, error => {
      this.graph_loader = false;

    });
  }

getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
  ngOnInit() {
    this.options = {
      "type": "serial",
      "addClassNames": true,
      "theme": "none",
      "autoMargins": true,
      "balloon": {
        "adjustBorderColor": false,
        "horizontalPadding": 10,
        "verticalPadding": 8,
        "color": "#ffffff"
      },
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
      }],
      "startDuration": 1,
      "graphs": [{
        "alphaField": "alpha",
        "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
        "fillAlphas": 1,
        "title": "Target Value",
        "valueField": "target_amount",
        "type": "column",
        "dashLengthField": "dashLengthColumn"
      }, {
        "id": "graph2",
        "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
        "bullet": "round",
        "lineThickness": 3,
        "bulletSize": 7,
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "useLineColorForBulletBorder": true,
        "bulletBorderThickness": 3,
        "fillAlphas": 0,
        "lineAlpha": 1,
        "axisAlpha": 0,
        "title": "Achieved Amount",
        "valueField": "achieved_amount",
        "dashLengthField": "dashLengthLine"
      }],
      "categoryField": "month_name",
      "categoryAxis": {
        "gridPosition": "start",
        "axisAlpha": 0,
        "tickLength": 0
      },
      "export": {
        "enabled": true
      }
    }

     this.lineOptions={
        "theme": "none",
        "type": "serial",
      "startDuration": 2, 
        "valueAxes": [{
            "position": "left",
            "title": "Amount"
        }],
        "graphs": [{
            "balloonText": "[[category]]: <b>[[value]]</b>",
            "fillColorsField": "color",
            "fillAlphas": 1,
            "lineAlpha": 0.1,
            "type": "column",
            "valueField": "amount"
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
            "labelRotation": 0
        },
        "export": {
          "enabled": true
         }

};
  }
  valueBox: boolean = false;
  valueBoxShow() {
    this.valueBox = !this.valueBox;
  }
  valueBoxHide() {
    this.valueBox = false;
  }
  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }
  setTarget(target: any) {
    this.service.setTarget(this.targetValue).subscribe((data: any) => {
      // alert(data.message);
      //this.targetValue=undefined;
      this.valueBoxHide();
      this.options.dataProvider = undefined;
      this.service.graphData().subscribe((data: any) => {
        this.options.dataProvider = data.monthly_target;
        this.keyDeals = data.key_deals;
        if (data.todays_tasks.length) {
          for (let i = 0; i < data.todays_tasks.length; i++) {
            var tsk_type = data.todays_tasks[i].taskable_type;
            tsk_type = tsk_type.split('\\');
            var link = this.createUserActivityLink(tsk_type[2]);
            data.todays_tasks[i].taskable_link = link;
          }
        }
        this.todayTask = data.todays_tasks;
      this.todayPayment = data.opp_today_payments;
        this.recent = data.recent_records;
      });
    });
  }
  refreshUserFeed() {
    this.activity_loader = true;
    this.service.getUserFeed().subscribe((data: any) => {
      if (data.feeds.length) {
        for (let i = 0; i < data.feeds.length; i++) {
          var link = this.createUserActivityLink(data.feeds[i].feedable_type);
          data.feeds[i].link_to = link;
        }
      }
      this.userFeed = data.feeds;
      this.current = data.links.current_page;
      this.links = data.links.links;
      this.userFeedlen = this.userFeed.length;
      this.activity_loader = false;
    }, error => {
      this.activity_loader = false;

    });
  }

  // refreshUserFeed(){
  //   var isChecked:any;
  //   var isDelete:any;
  //   var isUser:any;
  //   var isCreated:any;
  //   var isSend:any;
  //   this.activity_loader=true;
  //   this.service.getUserFeed().subscribe((data:any)=>{
  //         if(data.feeds.length){
  //           for(let i=0;i<data.feeds.length; i++){
  //               var link=this.createUserActivityLink(data.feeds[i].feedable_type);
  //               data.feeds[i].link_to=link;
  //               isChecked = data.feeds[i].message.split(" ");
  //               this.isAdded = isChecked[0];
  //               if(isDelete == "deleted"){
  //                 this.isAdded = true;
  //               }else if (isUser =="user") {
  //                 this.isAdded = true;
  //               } else if (isCreated == "created") {
  //                 this.isAdded =true;
  //               } else if (isSend == "send") {
  //                 this.isAdded = true;
  //               } else {
  //                 this.isAdded = false;
  //               }

  //           }
  //         }
  //         this.userFeed=data.feeds;
  //         this.current=data.links.current_page;
  //         this.links=data.links.links;
  //         this.userFeedlen=this.userFeed.length;
  //         this.activity_loader=false;
  //    }, error => {
  //          this.activity_loader=false;

  //   });
  // }
  viewMoreUserFeed() {

    if (this.current < this.links.length) {
      this.activity_loader = true;
      // alert(this.current);
      //  this.service.getUpdate(this.links[this.current]).subscribe((data:any)=>{
      this.service.getUpdate(this.current).subscribe((data: any) => {
        if (data.feeds.length) {
          for (let i = 0; i < data.feeds.length; i++) {
            var link = this.createUserActivityLink(data.feeds[i].feedable_type);
            data.feeds[i].link_to = link;
          }
        }
        this.userFeed.push(...data.feeds);
        this.current = data.links.current_page;
        this.links = data.links.links;
        this.userFeedlen = this.userFeed.length;
        this.activity_loader = false;
      });
    }
  }
  validate_number(evnt) {
    //console.log(evnt.target.value);
    evnt.target.value = evnt.target.value.replace(/[^0-9.]/g, '');
    evnt.target.value = evnt.target.value.replace(/(\..*)\./g, '$1');
    return evnt.target.value;
  }
  createUserActivityLink(feed_type) {
    var link = '';
    // console.log(feed_type);
    if (feed_type == "Account") {
      return link = "clientDetails";
    }
    if (feed_type == "PersonalAccount") {
      return link = "personelDetails";
    }
    if (feed_type == "Contact") {
      return link = "contactDetails";
    }
    if (feed_type == "Task") {
      return link = "tasks";
    }
    if (feed_type == "Report") {
      return link = "reportDisplay";
    }
    if (feed_type == "Opportunity") {
      return link = "oppoDetails";
    }
    if (feed_type == "Lead") {
      return link = "leaderDetails";
    }
    if (feed_type == "FileManagement") {
      // console.log('adsa');
      return link = "fileDetails";
    }
    if (feed_type == "ProformaInvoice") {
      // console.log('adsa');
      return link = "";
    }
    if (feed_type == "Email") { 
      return link = "";
    }
    if (feed_type == "Supplier") { 
      return link = "supplier-details";
    }

  }
}
