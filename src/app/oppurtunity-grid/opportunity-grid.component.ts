import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { OppurtunityService } from '../service/opportunity.service';
import { AccountsMapService } from '../service/accounts-map.service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { Column } from './../accounts-grid/column';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { MessageService } from '../message.service';
import { first } from 'rxjs-compat/operator/first';
import { Opportunity } from './opportunity';
import { FormService } from '../service/form.service';
import { FileService } from '../file.service';


@Component({
  selector: 'app-oppurtunity-grid',
  templateUrl: './opportunity-grid.component.html',
  styleUrls: ['./opportunity-grid.component.css']
})
export class OppurtunityGridComponent implements OnInit {
  kanbanData: any; 
  popUpMsg: string;
  displayedColumns: string[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  sviewName: string;
  sviewVisibility: number = 0;
  gridData: any;
  AllFilter: boolean = false;
  AllFilterNew: boolean = false;
  Editpop: boolean = false;
  editRow: number = -1;
  newopportunity: Opportunity = new Opportunity();
  allOperators: any;
  allColumn: Column[];
  columns: Column[];
  display_columns:any[];
  selectedColumn: string;
  updateColumnData: any = {
    account_id: undefined,
    column_id: undefined,
    column_data: undefined
  };
  updateValue: string;
  public options: Select2Options;

  public destOptions: Select2Options;
  public incOptions:Select2Options;
  public tagOptions:Select2Options;
  allView: any;
  exampleData: any = [];
  allDestinations: any = [];
  allTags:any=[];
  allInclusions:any=[];
  viewId: number = 0;
  filterElement = { "view_id": undefined, "col_name": undefined, "column_id": undefined, "op_name": undefined, "operator_id": undefined, "": undefined, "value": undefined , "is_additional": undefined };
  filterArray: any[] = [];
  colMap = {};
  addcolMap = {};
  opMap = {};
  ownerData: any[] = [];
  aFields: Column[];
  visiFields: Column[];
  reportToLst: any = [];
  account_owner: string;
  createData: any;
  AccountCont: boolean = true;
  PerAccountCont: boolean = false;
  popUpClass = false;
  curr_page = 2;
  totalData: any;
  totalCurrent = 10;
  pinned_view_id:any;
  isLocal=true;


  isStandard=false;
  standardFields=[];
  newStAccPop=false;
  formTitle="Add New Opportunity(standard)";
  st_formType="Opportunity";
  openStandard_f=false;
  openStandard(){
   this.openStandard_f=true;
   this.newStAccPop=true;
  }


  AccountContShow() {
    this.AccountCont = true;
    this.PerAccountCont = false;
  }
  PerAccountContShow() {
    this.AccountCont = false;
    this.PerAccountCont = true;
  }
  doneAccount() {
    this.AllFilter = false;
  }
  kanbanView: boolean = false;
  tableView: boolean = true;
  kanbanViewshow() {
    this.kanbanView = true;
    this.tableView = false;
  }
  tableViewshow() {
    this.kanbanView = false;
    this.tableView = true;
  }
  navigationOpen: string;
  navigationType: string;
  accounts_client:any;
   pipeline=true;
  constructor(private router: Router, private route: ActivatedRoute, private opportunitieservice: OppurtunityService,
    private acMap: AccountsMapService, private chRef: ChangeDetectorRef,
    public dialog: MatDialog, private fileService: FileService,private msg: MessageService, private formService: FormService) {

    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 
      ||  location.hostname.search("tnt1")>=0 ||  location.hostname.search("tfc8")>=0
      ||  location.hostname.search("adrenotravel")>=0){ 
         this.isLocal=true; 
         this.isStandard=true;
         this.isAttachment=true;
    } 
    this.account_owner = localStorage.getItem('user');
     this.destOptions = {
            width: '100%',
            multiple: true,
            // tags: true
        };
     this.incOptions = {
            width: '100%',
            multiple: true,
            // tags: true
        };
     this.tagOptions = {
            width: '100%',
            multiple: true,
            // tags: true
        };
    this.msg.sendMessage("oppo");
    this.opportunitieservice.reportsToList().subscribe((data: any) => {
      this.reportToLst = data.opportunities;
    });

    if(this.isStandard){
      this.opportunitieservice.getStandardFileds().subscribe((data: any) => {
        console.log(data);
        this.standardFields = data.standard_fields;
      });
    }

    this.opportunitieservice.getAllOperators().subscribe((data: any) => {
      this.allOperators = data.operators;
      for (let a of this.allOperators) {
        this.opMap[a.id] = a.name;
      }
      this.filterElement.operator_id = this.allOperators[0].id;
    });
    this.opportunitieservice.getAllColumnList().subscribe((data: any) => {
      this.allColumn = data.opportunity_all_columns;
      for (let a of this.allColumn) {
        this.colMap[a.id] = a.alias_name;
      }
      this.filterElement.column_id = this.allColumn[0].id;
    });
    this.opportunitieservice.setUpAccountsMap().subscribe((data: any) => {

      this.createData = data;
      //this.createData.accounts_client=[];
      this.opportunitieservice.getAllClients().subscribe((data: any) => {
        this.newopportunity.sales_stage_id = this.createData.sales_stages[0].id;
        this.newopportunity.probability = this.createData.sales_stages[0].probability;
        this.newopportunity.experience_id = '';
       // this.newopportunity.destination_id = [this.createData.destinations[0].id];
       // this.newopportunity.inclusion_id = [this.createData.inclusions[0].id];

        if(this.createData && this.createData.destinations){
          for(let destin of this.createData.destinations){
            //console.log(destin);
             this.allDestinations.push({ "id": destin.id, "text": destin.name+ ', ' +destin.country_name });
          }
        }      
        if(this.createData && this.createData.inclusions){
          for(let tag of this.createData.inclusions){
            //console.log(destin);
             this.allInclusions.push({ "id": tag.id, "text": tag.name });
          }
        }
        if(this.createData && this.createData.opportunity_tags){
          for(let tag of this.createData.opportunity_tags){
            //console.log(destin);
             this.allTags.push({ "id": tag.id, "text": tag.name });
          }
        }

        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if(this.pipeline){
            this.exampleData.push({ "id": -1, "text": "My Pipeline" });
        }
        if (data.opportunity_views != undefined) {
          for (let e of data.opportunity_views) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        } else {
          for (let e of data.opportunity_views) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        }
       
       setTimeout(() => {
             this.viewId=data.recent_view;
             this.pinned_view_id=data.recent_view;
             if(data){
                 this.setUpTableData(data);
             }
        }, 100); 
        this.navigationOpen = this.route.snapshot.queryParams['open'];
        this.navigationType = this.route.snapshot.queryParams['type'];

        if (this.navigationOpen != undefined && this.navigationOpen != null) {
          this.newAccPop = true;
          $("#newOppBtn").trigger("click");
          
          setTimeout(() => {
              $("#newOppPop").trigger("click");
            }, 1400); 
          console.log('open');
          this.popUpClass = true;
          if (this.navigationType == 'a') {
            this.newopportunity.account_id = this.navigationOpen;
            this.AccountContShow();
            setTimeout(() => {
              $("#newOppPop").trigger("click");
            }, 1400); 
            this.selectAccId(Number(this.navigationOpen));
            $("#inlineRadio1").attr('checked', 'checked');
          }
          else if (this.navigationType == 'c') {
            var acc_idd = this.route.snapshot.queryParams['acc'];
            this.newopportunity.account_id = acc_idd;
            this.newopportunity.contact_id = this.navigationOpen;
            this.AccountContShow();
            this.selectAccId(Number(acc_idd));
            $("#inlineRadio1").attr('checked', 'checked');
          } else if (this.navigationType == 'pa') {
            this.newopportunity.personal_account_id = this.navigationOpen;
            this.selectPerAccId(this.newopportunity.personal_account_id);
            setTimeout(() => {
              $("#inlineRadio2").attr('checked', 'checked');
              this.PerAccountContShow();
            }, 400);

          } else {

          }

        }
      });
    });

    this.get_additional_fields();

  }
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  AllFilterShowHide() {
    this.AllFilter = !this.AllFilter;
    this.AllFilterNew = false;
  }

  NewFilterShowHide() {
    this.AllFilterNew = !this.AllFilterNew;
    this.AllFilter = false;
  }


pinned_view(){
  this.pinned_view_id=this.viewId;
   this.opportunitieservice.pinned_view(this.viewId).subscribe((data) => {
    console.log(data);
      this.popUpMsg = JSON.stringify(data);
      this.openDialog(); 
      
    });
}
unpinned_view(){
  this.pinned_view_id=0;
   this.opportunitieservice.unpinned_view(this.viewId).subscribe((data) => {
    console.log(data);
      this.popUpMsg = JSON.stringify(data);
      this.openDialog(); 
      
    });
}

  EditPopShow(column: string, defaultV: any, account_id: number) {
    this.updateColumnData.column_id = column;
    this.updateColumnData.account_id = account_id;
    if (defaultV.id != undefined) {
      this.updateValue = defaultV.id;
    } else {
      this.updateValue = defaultV;
    } this.Editpop = true;
  }
  updateColumn() {
    this.updateColumnData.column_data = this.updateValue;
    this.updateColumnData.opportunity_id = this.updateColumnData.account_id;
    this.updateColumnData.account_id = undefined;
    this.opportunitieservice.updateSingleColumn(this.updateColumnData).subscribe((data) => {
      this.popUpMsg = JSON.stringify(data);
      this.openDialog();
      this.gridData.opportunities = [];
      for (let i = 1; i < this.curr_page; i++) {
        setTimeout(() => {
          this.loadMoreAllData(i, this.viewId);
        }, 100);
      }
    });
    this.updateColumnData = {};

  }
  loadMoreAllData(load_page, viewId) {
    if (viewId > 0) {
      this.opportunitieservice.fetchView(viewId, load_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationAllData(data);
        }
      });

    } else {
      this.opportunitieservice.moreClients(load_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationAllData(data);
        }
      });

    };
  }
  EditPopHide() {
    this.Editpop = false;
  }

  ngOnInit() {
    this.chRef.detectChanges();
    this.loadPermissionSet();
    this.newopportunity.close_date = new Date();//.toLocaleDateString();

    setTimeout(() => {
            this.load_form_data(); 
    }, 1400); 
  }
  view_opportunity = false;
  create_opportunity = false;
  download_opportunity = false;
  edit_opportunity = false;
  delete_opportunity = false;
  upload_opportunity = false;
load_selectCustom(){
 console.log($('.select2-results__options').children('li').eq(1).html());
 $('.select2-results__options').children('li').eq(1).css('border-bottom','1px solid #ccc');
} 
  loadPermissionSet() {
    if (localStorage.getItem('permissionArray') != null) {
      var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
      if (permissionArray.Opportunity) {
        console.log(permissionArray.Opportunity);
        permissionArray.Opportunity.forEach(permissions => {
          if (permissions.name == 'view_opportunity') {
            this.view_opportunity = true;
          }
          if (permissions.name == 'create_opportunity') {
            this.create_opportunity = true;
          }
          if (permissions.name == 'edit_opportunity') {
            this.edit_opportunity = true;
          }
          if (permissions.name == 'delete_opportunity') {
            this.delete_opportunity = true;
          }
          if (permissions.name == 'upload_opportunity') {
            this.upload_opportunity = true;
          }
          if (permissions.name == 'download_opportunity') {
            this.download_opportunity = true;
          }
        });
      }

    }
    if (this.view_opportunity == false) {
      this.popUpMsg = 'You are not Authorized to view this page!';
      this.openDialog();
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);

    }
  }

  getKeys(map) {
    let arr: any[] = [];
    for (let k in map) arr.push(k);
    return arr;
  }
  name_error = false;
  acct_error = false;
  cont_error = false;
  per_error = false;
  err_show = false;
  dest_error = false;
  exp_error=false;
  createnewStOpportunity(){
    if(this.checkStandardFiledValidation()==false){
      console.log('ff')
      return false;
    }
    
    console.log(this.newopportunity);
    //return false;

    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();
    } else {
      this.newopportunity.custom_fields = [];
      this.submit_opp();
    }
  }
  checkStandardFiledValidation(){
    var standard_error=false;
    if (this.AccountCont) { 
      this.newopportunity.opportunitable_type = "App\\Account";
    } else { 
      this.newopportunity.opportunitable_type = "App\\PersonalAccount";
    }
    for (let st_fld of this.standardFields) {
       if(st_fld.mandatory==1 && this.newopportunity[st_fld.name]==undefined){
           if((st_fld.name=='account_id' || st_fld.name=='contact_id') && this.AccountCont==false){
            continue;
           }
           else if(st_fld.name=='personal_account_id' && this.AccountCont){
            continue;
           }else{

           }

      console.log(this.newopportunity[st_fld.name],st_fld.name+'--MAN--'+st_fld.mandatory);
      this.popUpMsg = JSON.stringify('Please fill '+st_fld.label);
      this.openDialog();
      standard_error=true;
      return false;
    } 
    }
    if(standard_error==false){
      //return false; 
    }

  }
  createnewOpportunity() { 
    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();
    } else {
      this.newopportunity.custom_fields = [];
      this.submit_opp();
    }
  }
  submit_opp() {
    this.err_show = false;
    this.name_error = false;
    this.acct_error = false;
    this.cont_error = false;
    this.per_error = false;
    this.dest_error = false;
    this.exp_error=false;
     if (this.newopportunity.destinations == undefined || this.newopportunity.destinations.length == 0) {
      this.dest_error = true;
      this.err_show = true;
      this.popUpMsg = JSON.stringify('Please Select Destinations');
      this.openDialog();
    }
     if (this.newopportunity.experience_id == '') {  
      this.popUpMsg = JSON.stringify('Please Select experience');
      this.exp_error=true;
      this.err_show = true;
      this.openDialog();
    }
    if (this.newopportunity.name == undefined) {
      this.name_error = true;
      this.err_show = true;
      this.popUpMsg = JSON.stringify('Please fill name');
      this.openDialog();
    } 


    if (this.AccountCont && (this.newopportunity.account_id == undefined 
      || this.newopportunity.contact_id == undefined)) {
      this.popUpMsg = JSON.stringify("Please select an account and Contact");
      this.acct_error = true;
      this.cont_error = true;
      this.err_show = true;
      this.openDialog();
    }
    if (!this.AccountCont && this.newopportunity.personal_account_id == undefined) {
      this.popUpMsg = JSON.stringify("Please select a personel account");
      this.per_error = true;
      this.err_show = true;
      this.openDialog();

    }
    if (this.err_show) {
      return;
    }

    this.name_error = false;
    this.acct_error = false;
    this.cont_error = false;
    this.per_error = false;
    if (this.AccountCont) {
      this.newopportunity.personal_account_id = undefined;
      this.newopportunity.opportunitable_type = "App\\Account";
    } else {
      this.newopportunity.account_id = undefined;
      this.newopportunity.contact_id = undefined;
      this.newopportunity.opportunitable_type = "App\\PersonalAccount";
    }
    if (this.newopportunity.amount) {
      this.newopportunity.expected_revenue = this.newopportunity.probability * this.newopportunity.amount / 100;
    }
    this.newopportunity.close_date = new Date(this.newopportunity.close_date).toLocaleDateString();
    this.newopportunity.travel_date = new Date(this.newopportunity.travel_date).toLocaleDateString();
    console.log('ready to submit');
    this.newopportunity.documents=this.documentData;
    this.opportunitieservice.createClient(this.newopportunity).subscribe(data => {
      this.name_error = false;
      this.acct_error = false;
      this.cont_error = false;
      this.per_error = false;
      this.documentData=[];
      this.module_attachment=[];
      this.checkCurrentView();
      this.opennewopportunityPop();
      this.newStAccPop=false;
      this.popUpMsg = JSON.stringify(data);
      this.openDialog();
      this.newopportunity = new Opportunity();
      this.closeRightpanel();
    }, (err) => {
      this.popUpMsg = JSON.stringify(err);
    });

  }
  refreshAccountsGrid() {
    this.gridData = undefined;
    this.viewId = 0;

    this.opportunitieservice.setUpAccountsMap().subscribe(data => {
      this.createData = data;
      this.opportunitieservice.getAllClients().subscribe((data: any) => {
        this.exampleData = [];
        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if(this.pipeline){
            this.exampleData.push({ "id": -1, "text": "My Pipeline" });
        }
        if (data.opportunity_views != undefined) {
          for (let e of data.opportunity_views) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        } else {
          for (let e of data.account_view) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        }
        this.chRef.detectChanges();
        this.setUpTableData(data);

      });
    });

  }
  selectedDestin(dest_idd:any){
    this.newopportunity.destination_id=dest_idd;
    console.log(this.newopportunity.destination_id);
  }
  selectedIncl(incl_id:any){
    this.newopportunity.inclusion_id=incl_id;
    console.log(this.newopportunity.inclusion_id);
  }
  selectedTags(tag_id:any){
    this.newopportunity.tag_id=tag_id;
    console.log(this.newopportunity.tag_id);
  }
  renderNewView(viewId: any) {
    if (viewId != 0) {
      this.viewId = viewId;
      this.gridData = undefined;
      this.chRef.detectChanges();
      this.kanbanData = undefined;
      this.opportunitieservice.setUpAccountsMap().subscribe(data => {
        this.acMap.setUpMaps(data);
        this.createData = data;
         if(viewId==-1 && this.pipeline) {
            this.curr_page=1;
            this.loadPipelineData(viewId);
         }else {
            this.opportunitieservice.fetchView(viewId, 1).subscribe((datas: any) => {
              this.filterArray = datas.opportunity_filters;
              this.sviewVisibility = datas.opportunity_view.public_view;
              console.log(this.sviewVisibility);
              this.kanbanData = datas.sales_stages;
              this.setUpTableData(datas);
              this.totalCurrent = 10;
              this.curr_page = 2;
            });
      }
      });
    } else {
      this.refreshAccountsGrid();
    }
  }
  saveView() {
    this.opportunitieservice.createView(this.sviewName, this.sviewVisibility).subscribe(((data: any) => {
      
      this.refreshAccountsGrid();
      this.renderNewView(data.opportunity_view.id);
      setTimeout(() => {
        this.viewId = data.opportunity_view.id;
        this.checkCurrentView();
      }, 1500);

    }));

  }
  checkCurrentView() {
    this.selectedDestinationArray=[];
    if (this.viewId != undefined && this.viewId != 0) {
      this.renderNewView(this.viewId);
    } else {
      this.refreshAccountsGrid();
    }
  }
  setUpTableData(data: any) {
    this.displayedColumns = [];
    this.gridData = data;
    if (this.gridData.users != undefined) {
      this.ownerData = this.gridData.users;
    }
    this.totalData = data.total;
    
    this.dataSource = new MatTableDataSource(this.gridData.opportunities);
    this.columns = this.gridData.display_columns;
    this.display_columns = this.gridData.display_columns;
    var j=0;
    for (let c of this.columns) {
      this.displayedColumns.push(c.name);
      j++;
    } 
 
    if(this.isLocal){      
      this.additinalColumn = this.gridData.display_additional_columns?this.gridData.display_additional_columns:[];
      var add_fileds=this.additinalColumn;
      var display_columns=[];
      console.log(this.additinalColumn,'additinalColumnnnn');
      if(add_fileds){
      for (let cp of add_fileds) { 
        this.displayedColumns.push(cp.name);
        display_columns.push({ 
                          "alias_name" :cp.alias_name,
                          "created_at": cp.created_at,
                          "editable_flag": 0,
                          "id": cp.id,
                          "name": cp.name,
                          "tenant_id": cp.tenant_id,
                          "updated_at": cp.updated_at
                          }); 
        console.log(this.columns); 
      }}
    }
    this.display_columns= this.display_columns.concat(display_columns); 
    
    this.chRef.detectChanges();
    if (this.dataSource.paginator == undefined) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    ;
    this.chRef.detectChanges();

  }
loadPipelineData(viewId){
            this.viewId = viewId;
            this.opportunitieservice.get_pipeline_view(this.curr_page).subscribe((data: any) => {
             // this.filterArray = data.opportunity_filters;
             // this.sviewVisibility = data.opportunity_view.public_view;
              console.log(this.sviewVisibility);
              this.kanbanData = data.sales_stages;
              this.setUpTableData(data);
              this.totalCurrent = 10;
              this.curr_page = 2;
            });
}
  loadMoreData(viewId) {
  
    if (viewId > 0) {
      this.opportunitieservice.fetchView(viewId, this.curr_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationData(data); 
        }
      });

    } else {
      if (viewId == -1) {
        this.opportunitieservice.get_pipeline_view(this.curr_page).subscribe((data: any) => {             
              this.setPaginationData(data);
        });
       }else{
         this.opportunitieservice.moreClients(this.curr_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationData(data);
        }
      });
       }
     

    }
  }
  setPaginationData(data) {
    var a_data = data;
    var acc_data = a_data.opportunities;
    let that = this;
    Object.keys(acc_data).map(function (key) {
      that.gridData.opportunities.push(acc_data[key]);
    });
    this.totalCurrent = this.gridData.opportunities.length;
    this.dataSource = new MatTableDataSource(this.gridData.opportunities);

    this.curr_page = parseInt(a_data.pagination.current_page) + 1;

  }
  setPaginationAllData(data) {
    var a_data = data;
    var acc_data = a_data.opportunities;
    let that = this;
    Object.keys(acc_data).map(function (key) {
      that.gridData.opportunities.push(acc_data[key]);
    });
    this.totalCurrent = this.gridData.opportunities.length;
    this.dataSource = new MatTableDataSource(this.gridData.opportunities);


  }
  rep_filter_msg="";
  AddFilterElement() {
  this.rep_filter_msg="";
    try {
      if (this.viewId !== 0) {
        if(this.filterElement.value==''){
          this.popUpMsg=JSON.stringify('Please select filter value');
          this.openDialog();
          return;
        }
        this.filterElement.view_id = this.viewId;
        if (this.filterElement.value != undefined && 
          this.filterElement.column_id != undefined && this.filterElement.operator_id != undefined) {

          if (this.filterElement.value instanceof Date) {
            var dd = (this.filterElement.value.getDate() < 10 ? '0' : '') + this.filterElement.value.getDate();
            var MM = ((this.filterElement.value.getMonth() + 1) < 10 ? '0' : '') + (this.filterElement.value.getMonth() + 1);
            var yyyy = this.filterElement.value.getFullYear();
            this.filterElement.value = yyyy + '-' + MM + '-' + dd;
          }
             var i=0;   
             var filter_available=false;
            for(let filt of this.filterArray){
                  console.log(filt,'st fld');
                  if(filt.is_additional==0 && filt.column_id==this.filterElement.column_id.replace('-st','')){
                      this.filterArray[i].operator_id=this.filterElement.operator_id;
                      this.filterArray[i].value=this.filterElement.value;
                      filter_available=true;
                  }
                  if(filt.is_additional==1 && filt.column_id==this.filterElement.column_id.replace('-ad','')){
                      this.filterArray[i].operator_id=this.filterElement.operator_id;
                      this.filterArray[i].value=this.filterElement.value;
                      filter_available=true;
                  }

                  i++;
            }
          if (this.filterArray == undefined) {
            this.filterArray = [];
          }
          if(filter_available==false){
                  console.log(this.filterElement.column_id.split('-'));  
                  var c_fields=this.filterElement.column_id.split('-');
                  this.filterElement.column_id=c_fields[0];

                  if(c_fields && c_fields.length>1 && c_fields[1]=='ad'){
                     this.filterElement.is_additional=1;
                  }else{
                     this.filterElement.is_additional=0;
                  }

               this.filterArray.push(JSON.parse(JSON.stringify(this.filterElement)));
                  console.log(this.filterArray);
          }
          //this.filterArray.push(this.filterElement);
          this.AllFilterNew = false;
          this.filterElement = { "view_id": undefined, "col_name": undefined, "column_id": undefined, "op_name": undefined, "operator_id": undefined, "": undefined, "value": undefined , "is_additional": undefined };
        }
      } else {
        this.popUpMsg = JSON.stringify('Please select a view(Filter cannot be used on default view)');
        this.openDialog();
      }
    } catch (e) {

      this.popUpMsg = JSON.stringify(e);
      this.openDialog();
    }
    this.AllFilterNew = false;

  }

  saveFilter() {
    if (this.filterArray.length == 0) {
      this.filterElement.view_id = this.viewId;
      this.filterElement.column_id = "";
      this.filterElement.operator_id = "";
      this.filterElement.value = "";
      this.filterArray.push(this.filterElement);
    }

     let i=0;
      for(let filt of this.filterArray){  
        if(filt.column_id){
            if(filt.is_additional==1){
                this.filterArray[i].column_id=filt.column_id+'-ad'; 
            }else{
                this.filterArray[i].column_id=filt.column_id+'-st'; 

            }
        }
            i++;
      }
    //console.log(this.filterArray);return;
    
    this.opportunitieservice.saveFilter(this.filterArray).subscribe(data => {
      console.log("save " + JSON.stringify(data));
      this.renderNewView(this.viewId);
    });
    this.filterElement.view_id = undefined;
    this.filterArray = [];

  }

  getAvailableFields() {
    let col: Column[] = [];
    if (this.allColumn != undefined) {
      for (let c1 of this.allColumn) {
        let flag = true;
        for (let c of this.columns) {
          if (c.id == c1.id) {
            flag = false;
          }
        }
        if (flag) {
          col.push(c1);
        }
      }
    }
    return col;
  }

  getVisibleFields() {

    return this.columns;
  }
  visibleExtraFileds=[];
  availableExtraFileds=[];
  additinalColumn: any[];
  allAdditinalColumn: Column[];
  getVisibleAdditionalFields(){
     return (this.additinalColumn) ? this.additinalColumn : [];
  }   
  getAdditionalAvailableFields() { 
    let col: Column[] = [];
    for (let c1 of this.allAdditinalColumn) {
      let flag = true;
      for (let c of this.additinalColumn) {
        if (c.id == c1.id) {
          flag = false;
        } 
      }
      if (flag) {
        col.push(c1);
 
      }
        this.addcolMap[c1.id] = c1.alias_name;
    }
    return col; 
  } 
  moveToAdditionalVisisble() {

    this.availableExtraFileds = JSON.parse(JSON.stringify(this.availableExtraFileds));

    for (let a of this.availableExtraFileds) {
      this.additinalColumn.push(a);
    } 
    this.availableExtraFileds = [];
  }
  moveToAdditionalAvailable() {
    this.visibleExtraFileds = JSON.parse(JSON.stringify(this.visibleExtraFileds));
    for (let a of this.visibleExtraFileds) {

      for (let b in this.additinalColumn) {
        if (a.id == this.additinalColumn[b].id) {
          this.additinalColumn.splice(Number(b), 1);
          break;
        }
      }
    }
  }  
  moveAdditionalUp() {
    if (this.visibleExtraFileds) {
      let index = this.getIndexArrayAdditional();
      if (index.length != 0) {
        for (let i of index) {
          if (i != 0) {
            [this.additinalColumn[i - 1], this.additinalColumn[i]] = [this.additinalColumn[i], this.additinalColumn[i - 1]];
          }
        }
      }
    }
  }
  moveAdditionalDown() {
    if (this.visibleExtraFileds) {
      let c = [];
      let index = this.getIndexArrayAdditional();
      index.reverse();
      for (let i of index) {
        if (i < (this.additinalColumn.length - 1)) {
          let temp = this.additinalColumn[i];
          this.additinalColumn[i] = this.additinalColumn[i - 0 + 1];
          this.additinalColumn[i - 0 + 1] = temp;
        }
      }
    }
  }

getIndexArrayAdditional() {
    let index = [];
    for (let i in this.additinalColumn) {
      for (let j in this.visibleExtraFileds) {
        if (this.additinalColumn[i].id == this.visibleExtraFileds[j].id) {
          index.push(i);
        }
      }
    }
    return index;
  }

  removeFilter(i: number) {
    this.filterArray.splice(i, 1);
  }
filterValChange(){ 
   if(this.filterElement.column_id.search("-st")>-1){
    var col_id= this.filterElement.column_id.replace('-st','');
    this.fieldFilterChange(col_id);
    console.log('st');

   }else{
    var col_id= this.filterElement.column_id.replace('-ad','');
     this.fieldFilterChangeCustom(col_id);
    console.log('ad');

   }
 console.log(this.filterElement);
}
  filter_set=false;
  fetchFilterData(index){
  this.rep_filter_msg="";
console.log(this.filterArray[index]); 
    if(this.filterArray && this.filterArray.length >0 ){
        this.NewFilterShowHide();
        this.fieldFilterChange(this.filterArray[index].column_id);
        this.filterElement.operator_id=this.filterArray[index].operator_id;
        this.filterElement.value=this.filterArray[index].value;
        this.filterElement.is_additional=0;
        this.filter_set=true;
        this.checkDateFiled(this.filterArray[index].column_id,this.filterElement.value);
        this.filterElement.column_id=this.filterArray[index].column_id+'-st';
         
    }

  }   
 fetchFilterCustomData(index){
  this.rep_filter_msg="";

    if(this.filterArray && this.filterArray.length >0 ){
        this.NewFilterShowHide();
        this.fieldFilterChangeCustom(this.filterArray[index].column_id);
        this.filterElement.operator_id=this.filterArray[index].operator_id;
        this.filterElement.value=this.filterArray[index].value;
        this.filterElement.is_additional=1;
        this.filter_set=true;
        this.checkDateFiled(this.filterArray[index].column_id,this.filterElement.value);
        this.filterElement.column_id=this.filterArray[index].column_id+'-ad';
         
    }

  }   
 date_value_array=['CURRENT MONTH','PREVIOUS MONTH','TODAY','YESTERDAY','TOMORROW'];
  checkDateFiled(field_id,field_value){ 
  //  alert(field_id);
    console.log(this.allColumn)
    for(let col of this.allColumn){     
     if(col.id==field_id){
        var n:any = col.alias_name.search("Date");
        if(n > -1){
        this.date_format=true;
        this.date_range=true;
        }else{ 
           this.date_format=false;
        this.date_range=false;
        }
      }
    }
    for(let col of this.display_columns){     
     if(col.id==field_id){
        var n = col.alias_name.search("Date");
        if(n > -1){
        this.date_format=true;
        this.date_range=true;
        }else{ 
           this.date_format=false;
        this.date_range=false;
        }
      }
    } 

    var dd_check=false; 
    if(this.date_format==true){
      for(let dd of this.date_value_array){
        if(dd==field_value){
          dd_check=true;
        }
      }
    }
    if(dd_check==true){
      this.date_format=false;
    }
  }
  loadDate(type){
    if(type=='custom'){
      this.date_format=true; 
       this.filterElement.value='';
     setTimeout(()=>{
       $('#picker_dtt').focus();  
         },300);
    }else{
       this.date_format=false;
       this.filterElement.value=type;
    } 
  }
  more_range_show(){
    this.more_range=true;
  }
  less_range_show(){
    this.more_range=false;
  }
   more_range=false;
   date_range=false;
  date_format = false;
  filter_picklist=[];
  picklist_select=false;
  fieldFilterChange(id) { 
    this.filterElement.value='';
   // var field_id = val.target.value;
    var field_id=id;
    for (let col of this.allColumn) {
      console.log(field_id);
      if (col.id == field_id) {
        console.log(col.alias_name);
        var n = col.alias_name.search("Date");
        if (n > -1) {
          console.log('date');
          this.date_format = true;
        this.date_range=true;
        } else {
          console.log('no date');
          this.date_format = false;
        this.date_range=false;
        }
        if(col.alias_name=='Sales Stage'){
          this.filter_picklist=this.createData.sales_stages;
          this.picklist_select=true;
        }else if(col.alias_name=='Experience'){
          this.filter_picklist=this.createData.experiences;
          this.picklist_select=true;

        }else if(col.alias_name=='Inclusion(s)'){
          this.filter_picklist=this.createData.inclusions;
          this.picklist_select=true;

        }else if(col.alias_name=='Destination(s)'){
          this.filter_picklist=this.createData.destinations;
          this.picklist_select=true;
        }else if(col.alias_name=='Tag(s)'){
          this.filter_picklist=this.createData.opportunity_tags;
          this.picklist_select=true;
        }else if(col.alias_name=='Created By' || col.alias_name=='Last Modified By'  || col.alias_name=='Owner'){
          this.filter_picklist=this.ownerData;
          this.picklist_select=true;
          this.date_range=false; 
        }else{
          this.picklist_select=false;
        }
      }
    }
  }
  fieldFilterChangeCustom(id) { 
    this.filterElement.value='';
   // var field_id = val.target.value;
    var field_id=id;
    for (let col of this.allAdditinalColumn) {
      console.log(field_id);
      if (col.id == field_id) {
        console.log(col.alias_name);
        var n = col.alias_name.search("Date");
        if (col.type=='calender') {
          console.log('date');
          this.date_format = true;
        this.date_range=true;
        } else {
          console.log('no date');
          this.date_format = false;
        this.date_range=false;
        }



         if(col.name=='industries' || col.name=='salutations' || col.name=='ratings'
           || col.name=='lead_statuses' || col.name=='inclusion_id' || col.name=='task_priorities'
            || col.name=='experience_id' || col.name=='destination_id' || col.name=='itinerary_inclusions'
              || col.name=='sales_stage_id' || col.name=='tag_id'
               || col.name=='destinations'  ||  col.name =='opportunity_tags' || col.name =='experiences' || 
              col.name =='inclusions' || col.name =='sales_stages'){
          this.formService.load_picklist(col.name).subscribe((data: any) => {  
            this.filter_picklist=this.setPickDropdown(data,col.name); 
              this.picklist_select=true;
              }); 
        }else{
          this.picklist_select=false;
        }
        
      }
    }
  }

  moveToVisisble() {

    this.aFields = JSON.parse(JSON.stringify(this.aFields));

    for (let a of this.aFields) {

      this.columns.push(a);



    }
    console.log(this.columns);
    this.aFields = [];
  }
  moveToAvailable() {
    this.visiFields = JSON.parse(JSON.stringify(this.visiFields));
    for (let a of this.visiFields) {

      for (let b in this.columns) {
        if (a.id == this.columns[b].id) {
          this.columns.splice(Number(b), 1);
          break;
        }
      }
    }
  }
  updateColumns() {
    if (this.columns.length >= 15) {
      // alert('Selected display column should be less than 15');
      this.popUpMsg = JSON.stringify('Selected display column should be less than 15');
      this.openDialog();
    }
    else {
      let col_list = [];
      for (let a of this.columns) {
        col_list.push(a.id);
      }
      this.opportunitieservice.updateView(this.viewId, col_list).subscribe(data => {
        // alert(JSON.stringify(data));
        this.popUpMsg = JSON.stringify(data);
        this.openDialog();

          if(this.isLocal){
            
            let add_list = [];
            for (let a of this.additinalColumn) {
              add_list.push(a.id);
            }
            this.opportunitieservice.updateAdditionalView(this.viewId, add_list).subscribe(datas => {
              console.log(datas); 
            });

          } 
           setTimeout(() => {
               this.checkCurrentView();
           }, 1300);         
      });
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openNewAccountPop() {
    this.newAccPop = true;
  }

  /*New opportunity pop show*/
  newAccPop: boolean = false;
  opennewopportunityPop() {
    this.newAccPop = !this.newAccPop;
  }

  getOwnerName(id: number) {
    if (this.ownerData != undefined && id != undefined && this.ownerData.length != 0) {
      for (let obj of this.ownerData) {
        if (obj.id == id) {
          return obj.name;
        }
      }
    }
    return "NA";
  }
  getAccountName(id: number) {
    if (this.createData.accounts != undefined && id != undefined && this.createData.accounts.length != 0) {
      for (let obj of this.createData.accounts) {
        if (obj.id == id) {
          return obj.name;
        }
      }
    }
    return "NA";
  }
  getAliasName(input: any) {
    // alert(JSON.stringify(input));
    if (input != null && input != undefined)
      return input.name;
  }
  updateViewName() {
    if ((this.sviewName != undefined) && (this.sviewName != null) && (this.sviewName.trim() != "")) {
      this.opportunitieservice.renameView(this.viewId, this.sviewName).subscribe((data: any) => {
        this.exampleData = [];
        this.chRef.detectChanges();
        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if(this.pipeline){
            this.exampleData.push({ "id": -1, "text": "My Pipeline" });
        }
        if (data.opportunity_views != undefined) {
          for (let e of data.opportunity_views) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        }
        this.chRef.detectChanges();
        this.sviewName = undefined;
        this.popUpMsg = JSON.stringify(data);
        this.openDialog();
      });
    } else {
      this.popUpMsg = JSON.stringify({ "message": "Please enter the name" });
      this.openDialog();
    }
  }
  updateViewVisibility() {
    if (this.sviewVisibility != undefined && this.sviewVisibility != null) {
      this.opportunitieservice.viewVisibilityUpdate(this.viewId, this.sviewVisibility).subscribe((data: any) => {
        this.popUpMsg = JSON.stringify(data);
        this.openDialog();
      });
    } else {
      this.popUpMsg = JSON.stringify({ "message": "Please select an option" });
      this.openDialog();

    }
  }
  selectAccId(val: number) {
    this.autoAccList = [];
    this.fetch_acc_det(val);
    this.newopportunity.account_id = val;
    if (this.newopportunity.account_id != undefined && this.newopportunity.account_id != null) {
     // alert(this.newopportunity.account_id);
      this.opportunitieservice.fetchContactList(this.newopportunity.account_id).subscribe((data: any) => {
       // this.createData.accounts_client = data.contacts;
        this.accounts_client = data.contacts;
        console.log(this.accounts_client); 
      });
    }
  }

  selectStage(val: string) {
    for (let a of this.createData.sales_stages) {
      if (val == a.id) {
        this.newopportunity.probability = a.probability;
        break;
      }
    }

  }
  moveUp() {
    if (this.visiFields) {
      let index = this.getIndexArray();
      if (index.length != 0) {
        for (let i of index) {
          if (i != 0) {
            [this.columns[i - 1], this.columns[i]] = [this.columns[i], this.columns[i - 1]];
          }
        }
      }
    }
  }
  moveDown() {
    if (this.visiFields) {
      let c = [];
      let index = this.getIndexArray();
      index.reverse();
      for (let i of index) {
        if (i < (this.columns.length - 1)) {
          let temp = this.columns[i];
          this.columns[i] = this.columns[i - 0 + 1];
          this.columns[i - 0 + 1] = temp;
        }
      }
    }
  }
  getIndexArray() {
    let index = [];
    for (let i in this.columns) {
      for (let j in this.visiFields) {
        if (this.columns[i].id == this.visiFields[j].id) {
          index.push(i);
        }
      }
    }
    return index;
  }
  autoAccList = [];
  autoPerAccList = [];
  account_nameSearch: any;
  per_account_nameSearch: any;
  search_acc(evnt) {
    this.autoAccList = [];
    var val = evnt.target.value;

    console.log(val);
    if(val && val.length>2){
      this.opportunitieservice.searh_account(val).subscribe((data: any) => {
        console.log(data);
        if (data && data.accounts) {
          this.autoAccList = data.accounts;
        } else {
          this.autoAccList = [];
        }

      });
  }else{
      this.autoAccList = [];
    }

  }
  autoDestList=[];
  destination_nameSearch="";
  selectedDestinationArray=[];
search_dest() {
    this.autoDestList = [];
    var val = this.destination_nameSearch; 
    if(val && val.length>2){
        this.opportunitieservice.SearchDestinations(val).subscribe((data: any) => {
          console.log(data);
          if (data && data.destination) {
            this.autoDestList = data.destination;
          } else {
            this.autoDestList = [];
          }
        });
    }else{
        this.autoDestList = [];
    }

  }

  selectDestId(dest_id){
     var d_avail=false;
    for(let des of this.autoDestList){
      console.log(des);
      if(des.id==dest_id){        
          if(this.selectedDestinationArray.length>0){
            console.log('1');

              for(let avail of this.selectedDestinationArray){
                if(avail.id==dest_id){ 
                  d_avail=true;
                }
                  
              }
           if(d_avail==false){

             this.selectedDestinationArray.push(des);
           }
          }else{
            console.log('0');
             this.selectedDestinationArray.push(des);
          }
      }
    }
   this.autoDestList=[];
   this.destination_nameSearch="";
    console.log(this.selectedDestinationArray); 
    this.newopportunity.destinations=this.selectedDestinationArray;
    this.dest_error=false;
  }
  removeDestin(dest_id){
    var i=-1;
    var index=i;

      for(let avail of this.selectedDestinationArray){
        i++;  
        if(avail.id==dest_id){ 
          index=i;
        } 
      }
      if(index>-1){
           this.selectedDestinationArray.splice(index, 1);

      }
      this.newopportunity.destinations=this.selectedDestinationArray;
  }

  search_per_acc(evnt) {
    this.autoPerAccList = []; 
    var val = evnt.target.value;

    console.log(val);
    if(val && val.length>2){
    this.opportunitieservice.searh_p_account(val).subscribe((data: any) => {
      console.log(data);
      if (data && data.personal_accounts) {
        this.autoPerAccList = data.personal_accounts;
      } else {
        this.autoPerAccList = [];
      }


    });
  }else{
      this.autoPerAccList = [];
    }

  }
  fetch_acc_det(id) {
    this.autoPerAccList = [];
    this.opportunitieservice.fetch_acc_det(id).subscribe((data: any) => {
      console.log(data);
      if (data && data.account) {
        this.account_nameSearch = data.account.name;
      }

    });
  }
  selectPerAccId(id) {
    this.newopportunity.personal_account_id = id;
    this.autoPerAccList = [];
    this.opportunitieservice.fetch_p_det(id).subscribe((data: any) => {
      console.log(data);
      if (data && data.personal_account) {
        this.per_account_nameSearch = data.personal_account.first_name + ' ' + data.personal_account.last_name;
      }

    });
  }

  public extraformModel: any = {};
  customFields: any = [];
  set_extra_field_request() {
    this.customFields = [];
    $('.cust_err_frm').html('');
    //console.log(this.extraformModel);
    var i = 0;
    for (let obj in this.extraformModel) {
      //this.customFields[i]=[];
      console.log(this.extraformModel[obj]);
      var field_obj = this.extraformModel[obj];
      var value = $("#" + field_obj.name).val();
      var chk_av = $("#" + field_obj.name + "_check").length > 0 ? true : false;
      var chk_value = [];
      if (chk_av) {
        $("#" + field_obj.name + "_check input:checked").each(function () {
          chk_value.push($(this).val());
        });
        console.log(chk_value);
        value = chk_value.toString();
      }
      var radio_av = $("#" + field_obj.name + "_radio").length > 0 ? true : false;

      if (radio_av) {
        value = '';
        $("#" + field_obj.name + "_radio input:checked").each(function () {
          value = $(this).val();
        });
      }
      $("#" + field_obj.name).removeClass('frm-danger');
      if (field_obj.mandatory == 1 && value == '') {
        $("#" + field_obj.name).addClass('frm-danger');
        $("#" + field_obj.name + "_err_sp").html('This field is Mandatory!');
        this.popUpMsg = JSON.stringify('Please fill all mandatory fields');
        this.openDialog();
        return false;
      }
      var vJson = {
        "opportunity_id": "",
        "opp_additional_field_id": field_obj.id,
        "field_value": value ? value : '',
        "type": field_obj.type,
        "type_value": field_obj.type_value ? field_obj.type_value.toString() : ''
      };
      // console.log(value); 

      this.customFields.push(vJson);
      //this.customFields[i][key]=value;
      i++;
    }
    console.log(this.customFields);
    this.newopportunity.custom_fields = this.customFields;
    this.submit_opp();

  }
  extraFields: any;
  fr_options: any;
  allExtraFld: any[];
  get_additional_fields() {
    this.allExtraFld=[];

    this.formService.getAllfields('Opportunity').subscribe((data: any) => {
      console.log(data);
      this.extraFields = data.additional_fields;

      for (var i = 0; i <= data.additional_fields.length - 1; i++) {
        this.extraformModel[i] = [];
        this.extraformModel[i][data.additional_fields[i].name] = data.additional_fields[i].name;
        this.extraformModel[i]['id'] = data.additional_fields[i].id;
        this.extraformModel[i]['type'] = data.additional_fields[i].type;
        this.extraformModel[i]['type_value'] = data.additional_fields[i].type_value;
        this.extraformModel[i]['name'] = data.additional_fields[i].name;
        this.extraformModel[i]['mandatory'] = data.additional_fields[i].mandatory;
 
        this.allExtraFld.push({ 
                          "alias_name" :data.additional_fields[i].label,
                          "created_at": data.additional_fields[i].created_at,
                          "editable_flag": 0,
                          "id": data.additional_fields[i].id,
                          "name": data.additional_fields[i].name,
                          "tenant_id": "",
                          "updated_at": data.additional_fields[i].updated_at,
                          "type": data.additional_fields[i].type
                          }); 


        if (data.additional_fields[i].type_value) {
          this.fr_options = [];
          //for(let ty of data.additional_field.type_value){
          for (var j = 0; j <= data.additional_fields[i].type_value.length - 1; j++) {
            //console.log(data.additional_fields[i].type_value[j]);

            this.fr_options.push({
              id: j + 1,
              value: data.additional_fields[i].type_value[j]
            });

          }
          this.extraFields[i]['options'] = this.fr_options;
        } else {
          this.extraFields[i]['options'] = [];
        }
        console.log(this.extraFields);
      }
        this.allAdditinalColumn = this.allExtraFld;
    });

  }
  open_pull_it(dest_name,id) {
    localStorage.setItem('opp_dest', dest_name);
 localStorage.setItem('opp_dest_id',id);
    setTimeout(() => {
      let elem = document.getElementById('pullit_m_icon');
      let evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      elem.dispatchEvent(evt);
    }, 300);

  }
  closeRightpanel() {
    $('body').removeClass('right-bar-enabled');
  $('body').removeClass('modal-open');
$('body').css('padding-right',0);
  $('.modal-backdrop').remove();
  }
  delete_view(viewId) {
    var conf = confirm("Are you sure to delete this view?");

    if (conf) {
      this.formService.delete_view(viewId, 'opportunities').subscribe((data: any) => {
        console.log(data);
        this.popUpMsg = JSON.stringify(data);
        this.openDialog();
        this.refreshAccountsGrid();

      });
    }

  }


  picklistValues=[];
  load_form_data(){
    if (this.standardFields && this.standardFields.length > 0) {
      for (let k=0; k < this.standardFields.length;k++) { 
        this.picklistValues.push({'type_value':[{'id':1,"name":"nammmm"}]});
        if(this.standardFields[k].type=='picklist' || this.standardFields[k].type=='select2'){      
          let that=this;
          var pick_name=this.get_picklist_name(this.standardFields[k].name);
          this.formService.load_picklist(pick_name).subscribe((data: any) => {
            console.log(k); 
              this.picklistValues[k].type_value=this.setPickDropdown(data,this.standardFields[k].name);
              this.standardFields[k].type_value=this.setPickDropdown(data,this.standardFields[k].name);
              console.log(that.picklistValues[k]);  
             
              }); 
        }
      } 
    }
  } 
  get_picklist_name(picklist_selected){
    var picklistName='';
     
       if(picklist_selected=='industries'){
        picklistName='industries';
       }
       if(picklist_selected=='salutations'){
        picklistName='salutations';
       }
       if(picklist_selected=='ratings'){
        picklistName='ratings';
       }
       if(picklist_selected=='lead_statuses'){
        picklistName='lead_statuses';
       }
       if(picklist_selected=='inclusion_id'){
        picklistName='inclusions';
       }
       if(picklist_selected=='task_priorities'){
        picklistName='task_priorities';
       }
       if(picklist_selected=='experience_id'){
        picklistName='experiences';
       }
       if(picklist_selected=='destination_id'){
        picklistName='destinations';
       }
       if(picklist_selected=='itinerary_inclusions'){
        picklistName='itinerary_inclusions';
       }
       if(picklist_selected=='sales_stage_id'){
        picklistName='sales_stages';
       }
       if(picklist_selected=='tag_id'){ 
        picklistName='opportunity_tags';
       }
     return picklistName;

  }
  setPickDropdown(data,picklist_selected){ 
    var picklistAllValue=[];
     
       if(picklist_selected=='industries'){
        picklistAllValue=data.industries;
       }
       if(picklist_selected=='salutations'){
        picklistAllValue=data.salutations;
       }
       if(picklist_selected=='ratings'){
        picklistAllValue=data.ratings;
       }
       if(picklist_selected=='lead_statuses'){
        picklistAllValue=data.lead_statuses;
       }
       if(picklist_selected=='inclusion_id'){
        picklistAllValue=data.inclusions;
       }
       if(picklist_selected=='task_priorities'){
        picklistAllValue=data.task_priorities;
       }
       if(picklist_selected=='experience_id'){
        picklistAllValue=data.experiences;
       }
       if(picklist_selected=='destination_id'){
        picklistAllValue=data.destinations;
       }
       if(picklist_selected=='itinerary_inclusions'){
        picklistAllValue=data.inclusions;
       }
       if(picklist_selected=='sales_stage_id'){
        picklistAllValue=data.sales_stages;
       }
       if(picklist_selected=='tag_id'){
        console.log(data);
        picklistAllValue=data.opportunity_tags;
       }
       if(picklist_selected=='destinations'){
        picklistAllValue=data.destinations;
       } 
       
       if(picklist_selected=='opportunity_tags'){
        picklistAllValue=data.opportunity_tags;
       }   
       if(picklist_selected=='inclusions'){
        picklistAllValue=data.inclusions;
       } 
       if(picklist_selected=='experiences'){
        picklistAllValue=data.experiences;
       }  
       if(picklist_selected=='sales_stages'){
        picklistAllValue=data.sales_stages;
       } 
     return picklistAllValue;

  }
  validate_date(evnt){
    evnt.target.value='';
    return '';
  }



  
  isAttachment=true;  
  module_attachment: any = []; 
  all_attachment_urls: any = [];
  documentData: any = [];
  attachModalOpen=false;
  openAttachModeal(){
    this.attachModalOpen=true;
  }
  closeAttachModeal(){
    this.attachModalOpen=false;
  }
  attachFiles(files: FileList) {
    const file = files[0];
    let form = new FormData();
    form.set("email_image", file);
    let that1 = this;
    console.log(file);
    this.module_attachment.push(file.name);return;
    this.fileService.uploadFileTos3(form).subscribe((data: any) => {
      if (data.image_url) {
        this.module_attachment.push(data.name);  
      }
      console.log(this.module_attachment);
      this.closeAttachModeal();

    }, (error) => {
      this.popUpMsg = JSON.stringify('File unable to upload!');
      this.openDialog();
    });


  }
   removeModAttachment(index) {
    this.module_attachment.splice(index, 1); 
    this.documentData.splice(index, 1);  
  }
}
