import { Component, OnInit, ChangeDetectorRef, ViewChild ,ElementRef,NgZone } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { AccountsMapService } from '../service/accounts-map.service';
import { Router, ParamMap } from '@angular/router';
import * as $ from 'jquery';
import { Column } from './../accounts-grid/column';
import {DataSource,SelectionModel} from '@angular/cdk/collections';
import {Observable} from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { Contact } from '../contact-grid/contact';
import { LeadService } from '../service/lead.service';
import { MessageService } from '../message.service';
import { AdminServiceService } from '../service/admin-service.service';
import { MapsAPILoader } from '@agm/core';
import { FormControl ,FormGroup,FormBuilder,Validators} from '@angular/forms';
import { saveAs } from 'file-saver';
import { FormService } from '../service/form.service';
//import * as fileSaver from 'file-saver'; 
declare var google; 


@Component({
  selector: 'app-leader-grid',
  templateUrl: './leader-grid.component.html',
  styleUrls: ['./leader-grid.component.css']
})
export class LeaderGridComponent implements OnInit {
  massMail=new Object();
  errorMsg:string;
  popUpMsg:string;
  displayedColumns:string[]=[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  selection : SelectionModel<any>;
  countryList:any[];
  stateList:any[];
  cityList:any[];
  sviewName: string;
  sviewVisibility: number = 0;
  gridData: any;
  accType: any;
  accParent: any;
  rating: any;
  AllFilter: boolean = false;
  AllFilterNew: boolean = false;
  Editpop: boolean = false;
  industries: any;
  dataTable: any;
  editRow: number = -1;
  newContact: any={};
  allOperators: any;
  allColumn: Column[];
  columns: Column[];
  selectedColumn: string;
  updateColumnData: any = {
    account_id: undefined,
    column_id: undefined,
    column_data: undefined
  };
  updateValue: string;
  isFacebookUser=false;
  public options: Select2Options;
  allView: any;
  exampleData: any = [];;
  viewId: number = 0;
  filterElement = { "view_id": undefined, "col_name": undefined, "column_id": undefined, "op_name": undefined, "operator_id": undefined, "": undefined, "value": undefined, "is_additional": undefined  };
  filterArray: any[] = [];
  colMap = {};
  opMap = {};
  ownerData:any[]=[];
  aFields: Column[];
  visiFields: Column[];
  reportToLst:any=[];
  leadList:any=[];
  account_owner:string;
  status:any;
  destination:any;
  curr_page=2;
  totalData:any;
  totalCurrent=10;
  salutations=[{'name':'Mr'},{'name':'Mrs'}];

  isAttachment=false;  
  module_attachment: any = [];
  all_attachment: any = [];
  all_attachment_urls: any = [];
  documentData: any = [];
  attachModalOpen=false;
  openAttachModeal(){
    this.attachModalOpen=true;
  }
  closeAttachModeal(){
    this.attachModalOpen=false;
  }
   removeModAttachment(index) {
    this.module_attachment.splice(index, 1); 
    this.documentData.splice(index, 1);  
  }

    @ViewChild("search")
    public searchElementRef: ElementRef;  
    public searchControl: FormControl;  
    public zoom: number;
  public latitude: number;
  public longitude: number;
  public fulladdr: string;
  public country_code: string;
  public state_name: string;
  public city='';
  public zip_code: string;
  public country_name: string;
  //import data variables
  public importPop=false;
   public csvContent: string;
   public parsedCsv:any;
   public importArray: any = [];
   public extData:any; 
   public upload_body;
   public preview_body:any;
   public preview_loader=false;
   public dataImport:any;
   public importColumn:any;
   public export_types:any;
   public validate_fields:any;
   public valid_column:any;
   public email_valid=false;
   pipeline=false;
  constructor(private router: Router,
        private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private leadService: LeadService, 
    private acMap: AccountsMapService, private chRef: ChangeDetectorRef,
    public dialog: MatDialog, private msg :MessageService
    ,private admService:AdminServiceService,private formService:FormService) {
    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 
      ||  location.hostname.search("tnt1")>=0 ||  location.hostname.search("tfc8")>=0
      ||  location.hostname.search("adrenotravel")>=0
      ||  location.hostname.search("prashtest.")>=0){ 
         this.isLocal=true; 
         this.isStandard=true;
    }   
    this.checkFBStatus();
      this.account_owner = localStorage.getItem('user');
      this.msg.sendMessage("lead");
      this.leadService.reportsToList().subscribe((data:any)=>{
        this.reportToLst=data.leads;
      });  
    this.leadService.getCountryList().subscribe((data: any) => {
      this.countryList = data.countries;
    });

    this.formService.getAllUsers().subscribe((data: any) => {
      console.log(data);
      if (data.users != undefined) {
        let i = 0;
         this.assignData.push({ "id": 0, "text": "Select User" });
        for (let e of data.users) {
          //console.log(e.id);
          this.assignData.push({ id: e.id, text: e.name });
          i++;
        }
      }
    });
    this.leadService.getAllOperators().subscribe((data: any) => {
      this.allOperators = data.operators;
      for (let a of this.allOperators) {
        this.opMap[a.id] = a.name;
      }
      this.filterElement.operator_id=this.allOperators[0].id;
    });
    this.leadService.getAllColumnList().subscribe((data: any) => {
      
      this.allColumn = data.lead_all_columns;
      for (let a of this.allColumn) {
        this.colMap[a.id] = a.alias_name;
      }
      this.filterElement.column_id=this.allColumn[0].id;
    });


    if(this.isStandard){
      this.leadService.getStandardFileds().subscribe((data: any) => {
        console.log(data);
        this.standardFields = data.standard_fields;
      });
    }

    setTimeout(() => {
            this.load_form_data(); 
    }, 1400); 

   
//this.getSalutations();
    //custom additional fields
this.get_additional_fields();
  }

   checkFBStatus(){ 
    this.formService.chekFbStatus().subscribe((data: any) => { 
      this.isFacebookUser=data.fb_status; 

    });
  }
  fb_leads(){
     this.viewId=0;
     setTimeout(() => { 
      this.totalCurrent=5000;
      this.leadService.getFBLeads().subscribe((data:any) => {
          
        this.chRef.detectChanges();
        this.setUpTableData(data);

     });
        }, 1400); 
     
  }  
  ngOnInit() {
     this.leadService.setUpAccountsMap().subscribe((data:any) => {
      this.industries = data.industries;
      this.status=data.lead_statuses;
      this.rating=data.ratings;
      this.destination=data.destinations;
      this.salutations=data.salutations;
      this.newContact.salutation="Mr";
      this.newContact.industry_id=this.industries[0].id;
      this.newContact.lead_status_id=this.status[0].id;
      this.newContact.rating_id=this.rating[0].id;
      this.leadService.getAllClients().subscribe((data: any) => {
        this.leadList=data.lead_statuses;
        this.export_types=data.export_types;
        this.importColumn=data.import_columns; 
        var result = [];

        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if (data.lead_views != undefined) {
          for (let e of data.lead_views) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        } else {
          for (let e of data.lead_views) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        }
        setTimeout(() => {
             this.viewId=data.recent_view;
             this.pinned_view_id=data.recent_view;
        }, 1400); 
        this.setUpTableData(data);
        this.newContact.owner_id = data.auth_user.id; 
       });
    });
    this.chRef.detectChanges();
   this.loadPermissionSet();
  }
  view_lead = false;
  create_lead=false;
  download_lead=false;
  edit_lead=false;
  delete_lead=false;
  upload_lead=false;
  view_facebook = false;

   loadPermissionSet() {
        if (localStorage.getItem('permissionArray') != null) {
            var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
            if (permissionArray.Lead) {
              console.log(permissionArray.Lead);
                permissionArray.Lead.forEach(permissions => {
                    if (permissions.name == 'view_lead') {
                        this.view_lead = true;
                    }
                    if (permissions.name == 'create_lead') {
                        this.create_lead = true;
                    }
                    if (permissions.name == 'edit_lead') {
                        this.edit_lead = true;
                    }
                    if (permissions.name == 'delete_lead') {
                        this.delete_lead = true;
                    }
                    if (permissions.name == 'upload_lead') {
                        this.upload_lead = true;
                    }
                    if (permissions.name == 'download_lead') {
                        this.download_lead = true;
                    }
                });
            }
            if (permissionArray.Facebook) { 
                permissionArray.Facebook.forEach(permissions => {
                    if (permissions.name == 'view_facebook_lead') {
                        this.view_facebook = true;
                    } 
                });
            }

          }
          this.isAdmin = localStorage.getItem('ARole') != undefined && localStorage.getItem('ARole') == "1"?1:0;
          
          console.log(this.view_facebook,'view_facebook');
          console.log(this.isAdmin,'is_admin');
          if(this.view_lead==false){
            //alert('You are not Authorized to view this page!';);
            this.popUpMsg='You are not Authorized to view this page!';
            this.openDialog();
             this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);

          }
  }

  isAdmin=0;
 getSalutations(){      
  this.admService.getSalutations().subscribe((data:any)=>{
    this.salutations=data.salutations;
  });
 }

 
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
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

  EditPopShow(column: string, defaultV: string, account_id: number) {

    this.updateColumnData.column_id = column;
    this.updateColumnData.account_id = account_id;
    this.updateValue = defaultV;
    this.Editpop = true;
  }
  updateColumn() {
    //alert(this.updateColumnData.column_id);
    this.updateColumnData.column_data = this.updateValue;
    this.updateColumnData.lead_id  = this.updateColumnData.account_id ;
    this.updateColumnData.account_id=undefined;
    this.leadService.updateSingleColumn(this.updateColumnData).subscribe((data) => {
      // console.log(JSON.stringify(data));
    this.popUpMsg=JSON.stringify(data);
    this.openDialog();
    this.gridData.leads=[];
    for(let i=1;i < this.curr_page;i++){
         setTimeout(()=>{
             this.loadMoreAllData(i,this.viewId);
         },100);
    }
    // this.renderNewView(this.viewId);
    });
    this.updateColumnData = {};
    
  }
loadMoreAllData(load_page,viewId){

  if(viewId>0){
    this.leadService.fetchView(viewId,load_page).subscribe((data:any) => {
         if(data){   
           this.setPaginationAllData(data);    
         } 
    });

   }else{
    this.leadService.moreClients(load_page).subscribe((data:any) => {
         if(data){   
           this.setPaginationAllData(data);    
         } 
    });

   } 
   //  this.leadService.moreClients(load_page).subscribe((data:any) => {
   //    if(data){
   //      var a_data=data; 
   //      var acc_data=a_data.leads; 
   //      let that=this;
   //      Object.keys(acc_data).map(function(key) {
   //            that.gridData.leads.push(acc_data[key]);
   //      });              
   //      this.totalCurrent=this.gridData.leads.length;
   //      this.dataSource=new MatTableDataSource(this.gridData.leads);     
   //    } 
   // });
}
  EditPopHide() {
    this.Editpop = false;
  }

  
 doneAccount(){
    this.AllFilter=false;
  }
  name_error=false;
  comp_error=false;
  status_error=false;

  createnewStLead(){
    if(this.checkStandardFiledValidation()==false){
      console.log('ff')
      return false;
    }
    
    console.log(this.newContact);
    //return false;

    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();
    } else {
      this.newContact.custom_fields = [];
      this.createnewContact();
    }
  }
  checkStandardFiledValidation(){
    var standard_error=false; 
    for (let st_fld of this.standardFields) {
       if(st_fld.mandatory==1 && this.newContact[st_fld.name]==undefined){
            

      console.log(this.newContact[st_fld.name],st_fld.name+'--MAN--'+st_fld.mandatory);
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
  createnewContact() {
        if(this.extraFields && this.extraFields.length>0){
           this.set_extra_field_request();
        }else{
           this.newContact.custom_fields=[];
           this.submit_leads();
        }
      }
  email_error=false;
  submit_leads(){    
    this.errorMsg=undefined;
     if(this.email_error){
      //alert('f');
       this.popUpMsg=JSON.stringify('Please fill valid email id!');
       this.openDialog();     
       return;
    }
    if(this.newContact.dob){
      let date = new Date(this.newContact.dob);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    this.newContact.dob=day + '/' + month + '/' + year;
    }
    
    this.newContact.documents=this.documentData;
   
    if(this.newContact.last_name != undefined &&  this.newContact.lead_status_id !=undefined){
        this.leadService.createClient(this.newContact).subscribe((data:any) => {
          // alert(JSON.stringify(data));
          if(!data.Error){
            this.checkCurrentView();
            this.opennewContactPop();
            this.newContact=new Object();
            this.name_error=false;
            this.comp_error=false;
            this.status_error=false;

            this.newStAccPop=false;
          }
          this.popUpMsg=JSON.stringify(data);
          this.openDialog();
          this.closeRightpanel();
        });
      }else{
        this.name_error=true; 
        this.status_error=true;
        //this.errorMsg="Please Fill the Mandatory Fields(Last Name,  Company and lead status)";
            this.popUpMsg=JSON.stringify('Please fill all mandatory fields');
            this.openDialog(); 
            return;
      }
  }
  refreshAccountsGrid() {
    this.gridData = undefined;
    this.viewId = 0;

    this.leadService.setUpAccountsMap().subscribe(data => {
      this.acMap.setUpMaps(data);
      this.accParent = this.acMap.accParentMapData;
      this.accType = this.acMap.accTypeMapData;
      this.rating = this.acMap.ratingsMapData;
      this.industries = this.acMap.industriesMapData;
      this.newContact.salutation="Mr";
      this.newContact.industry_id=this.industries[0].id;
      this.newContact.lead_status_id=this.status[0].id;
      this.newContact.rating_id=this.rating[0].id;
      this.leadService.getAllClients().subscribe((data: any) => {
        this.exampleData=[];
        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if (data.lead_views != undefined) {
          for (let e of data.lead_views) {
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
  renderNewView(viewId: any) {
   //alert(viewId);
    if (viewId != 0  && viewId != undefined) {
      this.viewId = viewId;
      this.gridData = undefined;
      this.chRef.detectChanges();
      this.leadService.setUpAccountsMap().subscribe(data => {
        this.acMap.setUpMaps(data);
        this.accParent = this.acMap.accParentMapData;
        this.accType = this.acMap.accTypeMapData;
        this.rating = this.acMap.ratingsMapData;
        this.industries = this.acMap.industriesMapData;
      
         if(viewId==-1 && this.pipeline) {
            //alert('my pipeline');
            this.viewId = viewId;
         }else{
           this.leadService.fetchView(viewId,1).subscribe((data: any) => {
             this.filterArray = data.lead_filters;
             this.sviewVisibility=data.lead_view.public_view;
          console.log(this.sviewVisibility);  
          this.setUpTableData(data);
           this.totalCurrent=10;
           this.curr_page=2;  
        });
         }
       
      });
    } else {
      this.refreshAccountsGrid();
    }
  }
  saveView() {
    this.leadService.createView(this.sviewName, this.sviewVisibility).subscribe(((data:any) => {
      this.viewId=data.lead_view.id;
      this.refreshAccountsGrid();
      this.renderNewView(data.lead_view.id);
      setTimeout(()=>{
            this.viewId=data.lead_view.id; 
         },1500);
    }));
    
  }
  checkCurrentView() {
    this.closeRightpanel();
    if (this.viewId != undefined  && this.viewId != 0) {
       this.renderNewView(this.viewId);
    } else {
       this.refreshAccountsGrid();
    }
  }
  assignData: any = [];
  lead_new_owner_id: any;
  ownerShipEdit = false;
  public ownerOptions: Select2Options;
  openOwnership() {
    this.ownerShipEdit = true;
   // this.lead_new_owner_id = this.clientDetails.owner_id;
  }
  setAssignUser(value) {
    this.lead_new_owner_id = value;
  }
  selectBox() {
    $(".select2-container").css("z-index", 5000);
  }
  changeOwnerMultiple() {
    


    var changeOwn = {
      lead_id: this.selection.selected,
      lead_new_owner_id: this.lead_new_owner_id,
    };
    if(this.lead_new_owner_id>0){
          this.formService.changeOwnerMultiple(changeOwn, "lead").subscribe((data: any) => {
                this.closeOwner();
                this.popUpMsg = JSON.stringify(data.message);
                this.openDialog(); 
                this.checkCurrentView();

              });
    }else{
                this.popUpMsg = JSON.stringify('Please select user!');
                this.openDialog(); 

    } 
    
  }
  closeOwner() {
    this.ownerShipEdit = false;
  }
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
        console.log(this.selection);
  }
  setUpTableData(data: any) {
    this.displayedColumns=['select'];
    this.gridData = data;
    if(this.gridData.users!=undefined){
      this.ownerData=this.gridData.users;
    }
    this.totalData=data.total;
    
    this.dataSource=new MatTableDataSource(this.gridData.leads);
    this.selection = new SelectionModel(true, []);
    this.columns = this.gridData.display_columns;
    this.display_columns = this.gridData.display_columns;
    var j=0;
    for (let c of this.columns) {
      this.displayedColumns.push(c.name);
      j++;
    } 
 
    if(this.isLocal){      
      this.additinalColumn = this.gridData.display_additional_columns;
      var add_fileds=this.additinalColumn;
      var display_columns=[];
      console.log(this.additinalColumn);
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
    if(this.dataSource.paginator==undefined){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    }

    ;
    this.chRef.detectChanges();
    
  }

loadMoreData(viewId){ 
    if(viewId>0){
    this.leadService.fetchView(viewId,this.curr_page).subscribe((data:any) => {
         if(data){   
           this.setPaginationData(data);    
         } 
    });

   }else{
    this.leadService.moreClients(this.curr_page).subscribe((data:any) => {
         if(data){   
           this.setPaginationData(data);    
         } 
    });

   }
    // this.leadService.moreClients(this.curr_page).subscribe((data:any) => {
    //      if(data){
    //        var a_data=data; 
    //        var acc_data=a_data.leads;
    //        let that=this;
    //        Object.keys(acc_data).map(function(key) {
    //              that.gridData.leads.push(acc_data[key]);
    //         });              
    //        this.totalCurrent=this.gridData.leads.length;
    //        this.dataSource=new MatTableDataSource(this.gridData.leads); 
    //        this.curr_page=parseInt(a_data.pagination.current_page) + 1;   
                
    //      } 
    // });
}
setPaginationData(data){
           var a_data=data; 
           var acc_data=a_data.leads;
           let that=this;
           Object.keys(acc_data).map(function(key) {
                 that.gridData.leads.push(acc_data[key]);
            });              
           this.totalCurrent=this.gridData.leads.length;
           this.dataSource=new MatTableDataSource(this.gridData.leads); 
             
           this.curr_page=parseInt(a_data.pagination.current_page) + 1; 

}
setPaginationAllData(data){
           var a_data=data; 
           var acc_data=a_data.leads;
           let that=this;
           Object.keys(acc_data).map(function(key) {
                 that.gridData.leads.push(acc_data[key]);
            });              
           this.totalCurrent=this.gridData.leads.length;
           this.dataSource=new MatTableDataSource(this.gridData.leads);           

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
        if (this.filterElement.value != undefined && this.filterElement.column_id != undefined && this.filterElement.operator_id != undefined) {
          
           if(this.filterElement.value instanceof Date){
            var dd = (this.filterElement.value.getDate() < 10 ? '0' : '') + this.filterElement.value.getDate();
            var MM = ((this.filterElement.value.getMonth() + 1) < 10 ? '0' : '') + (this.filterElement.value.getMonth() + 1);
            var yyyy = this.filterElement.value.getFullYear();
            this.filterElement.value=yyyy+'-'+MM+'-'+dd;
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
          this.AllFilterNew = false;
          this.filterElement={ "view_id": undefined, "col_name": undefined, "column_id": undefined, "op_name": undefined, "operator_id": undefined, "": undefined, "value": undefined , "is_additional": undefined };;
        }
      } else {
        // alert('Please select a view(Filter cannot be used on default view)');
        this.popUpMsg=JSON.stringify('Please select a view(Filter cannot be used on default view)');
        this.openDialog();
      }
    } catch (e) {
      // alert('Please select a view(Filter cannot be used on default view)');
      
      this.popUpMsg=JSON.stringify(e);
      this.openDialog();
    }
    this.AllFilterNew = false;
  }

  saveFilter() {
    if(this.filterArray.length==0){
      this.filterElement.view_id=this.viewId;
      this.filterElement.column_id="";
      this.filterElement.operator_id="";
      this.filterElement.value="";
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
    this.leadService.saveFilter(this.filterArray).subscribe(data => {
      console.log("save " + JSON.stringify(data));
      this.renderNewView(this.viewId);
      });
      this.filterElement.view_id=undefined;
      this.filterArray=[];

  }

  getAvailableFields() {
    let col: Column[] = [];
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
    return col;
  }

  getVisibleFields() {

    return this.columns;
  }
  removeFilter(i: number) {

    this.filterArray.splice(i, 1);
  }
  moveToVisisble() {

    this.aFields = JSON.parse(JSON.stringify(this.aFields));

    for (let a of this.aFields) {

      this.columns.push(a);



    }
    //console.log(this.columns);
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
      this.popUpMsg=JSON.stringify('Selected display column should be less than 15');
      this.openDialog();
    }
    else {
      let col_list = [];
      for (let a of this.columns) {
        col_list.push(a.id);
      }
      this.leadService.updateView(this.viewId, col_list).subscribe(data => { 
        this.popUpMsg=JSON.stringify(data);
        this.openDialog();

          if(this.isLocal){
            
            let add_list = [];
            for (let a of this.additinalColumn) {
              add_list.push(a.id);
            }
            this.leadService.updateAdditionalView(this.viewId, add_list).subscribe(datas => {
              console.log(datas); 
            });

          } 
           setTimeout(() => {
               this.checkCurrentView();
           }, 1300);  
      });
    }
  }
  moveUp(){
    if(this.visiFields){
      let index=this.getIndexArray();
      if(index.length!=0){
        for(let i of index){
          if(i!=0){
            [this.columns[i-1],this.columns[i]]=[this.columns[i],this.columns[i-1]];
          }
        }
      }
    }
  }
  moveDown(){
    if(this.visiFields){
      let c=[];
      let index=this.getIndexArray();
      index.reverse();
        for(let i of index){
          if(i<(this.columns.length-1)){
            let temp=this.columns[i];
            this.columns[i]=this.columns[i-0+1];
            this.columns[i-0+1]=temp;
          }
        }
    }
  }
  getIndexArray(){
    let index=[];
    for(let i in this.columns){
      for(let j in this.visiFields){
        if(this.columns[i].id==this.visiFields[j].id){
          index.push(i);
        }
      }
    }
    return index;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openNewAccountPop(){
    this.newAccPop=true;
     this.searchControl = new FormControl();
     setTimeout(()=>{
            this.loadAddressAutocomplete();
         },500);
  }
 loadAddressAutocomplete(){
       
        this.zoom = 4;
        this.latitude = 39.8282;
        this.longitude = -98.5795;
        this.mapsAPILoader.load().then(() => {  
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ["address"]
          }); 
          autocomplete.addListener("place_changed", () => {
            this.country_name ='';
                this.state_name ='';
                this.city = '';
                this.zip_code = ''; 
            this.ngZone.run(() => {
               let place = autocomplete.getPlace();
               let that=this;
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }else{            

                        that.latitude = place.geometry.location.lat();
                        that.longitude = place.geometry.location.lng();
                        that.zoom = 12;
                        that.fulladdr = place.formatted_address;
                        var street_address="";
                        var street_number="";
                        var street_route=""; 
                        for (var i = 0; i < (place.address_components).length; i++) {
                          if (place.address_components[i].types[0] == 'street_number') {
                            street_number  = place.address_components[i].long_name; 
                          }
                          if (place.address_components[i].types[0] == 'route') { 
                            street_route  = place.address_components[i].long_name; 
                          }
                          if (place.address_components[i].types[0] == 'country') {
                            that.country_name = place.address_components[i].long_name;
                            that.country_code = place.address_components[i].short_name;
                          }
                          if (place.address_components[i].types[0] == "administrative_area_level_1") {
                            that.state_name = place.address_components[i].long_name;
                          }
                          if (place.address_components[i].types[0] == "locality") {
                            that.city = place.address_components[i].long_name;
                          }
                          if (place.address_components[i].types[0] == "postal_code") {
                            that.zip_code = place.address_components[i].long_name;
                          }
                        }
              }
                var street_add=street_number?street_number+' ':'';
                street_address=street_add+street_route; 
                this.newContact.country =this.country_name;
                this.newContact.state =this.state_name;
                this.newContact.city = this.city;
                this.newContact.zip = this.zip_code;
                this.newContact.street = street_address;
            }); 
          });
        });
    }


  /*New contact pop show*/
newAccPop:boolean=false;
  opennewContactPop(){
    this.newAccPop=!this.newAccPop;
  }

  fetchState(){
    this.leadService.getStateList(Number(JSON.parse(this.newContact.country).id)).subscribe((data: any) => {
      this.stateList = data.states;
    });    
  }
  
  fetchCity(){
    this.leadService.getCityList(Number(JSON.parse(this.newContact.state).id)).subscribe((data: any) => {
      this.cityList = data.cities;
    });    
  }
  getOwnerName(id:number){
    // alert(id);
    // alert(this.ownerData);

    if(this.ownerData!=undefined && id != undefined && this.ownerData.length!=0){
      for(let obj of this.ownerData){
        if(obj.id==id){
          return obj.name;
        }
      }
    }
    return "NA";
  }
  updateViewVisibility(){
    if(this.sviewVisibility!=undefined && this.sviewVisibility!=null){
    this.leadService.viewVisibilityUpdate(this.viewId,this.sviewVisibility).subscribe((data:any)=>{
      this.popUpMsg=JSON.stringify(data);
      this.openDialog();
    });
  }else{
    this.popUpMsg=JSON.stringify({"message":"Please select an option"});
  this.openDialog();
    
  }
  }
  renameView(){
    if((this.sviewName!=undefined)&& (this.sviewName!=null)&& (this.sviewName.trim()!="")){
      this.leadService.rename(this.viewId,this.sviewName).subscribe((data:any)=>{
        this.exampleData=[];
        this.chRef.detectChanges();
         this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
          if (data.lead_views != undefined) {
            for (let e of data.lead_views) {
              this.exampleData.push({ "id": e.id, "text": e.name });
            }
          } 
        this.chRef.detectChanges();
        this.sviewName=undefined;
        this.popUpMsg=JSON.stringify(data);
        this.openDialog();
      });
    }else{
      this.popUpMsg=JSON.stringify({"message":"Please enter the name"});
      this.openDialog();
    }
  }
  templates:any[];
  selectedTemplate=
  { id:'',
    subject:"",
    body:"",
    name:''
  };
  viewName:any;
  fetchMailMeta(){
    this.leadService.getMassMailMeta(this.viewId).subscribe((data:any)=>{
      this.templates= data.email_templates;
      this.viewName=data.lead_view;
    })
  }
  sendMassMail(){
     this.popUpMsg = JSON.stringify('Your bulk email has not been activated yet!.Please contact TutterflyCRM team to activate bulk mail!');
      this.openDialog();
      return;
     let send={
      view_id:this.viewName.id,
    from_address:localStorage.getItem('fromMail'),
    to_address:this.viewName.name,
    subject:this.selectedTemplate.subject,
    description_html:this.selectedTemplate.body,
    email_template:this.selectedTemplate.id
    }
    
    this.leadService.sendMassMail(send).subscribe((data:any)=>{
      this.popUpMsg=JSON.stringify(data);
      this.openDialog();
    })

  }
  sTemplate:any
  change(){
    this.selectedTemplate=JSON.parse(this.sTemplate+"");
  }


//import leads:

 

  export_data(){
    
    this.leadService.exportData().subscribe((res:any)=>{      
      console.log(res);
      this.downloadFile(res);
    },error=>{
           console.log(error);
     });
  }

  downloadFile(data: any) {
      const blob = new Blob([data], { type: 'text/csv' });
       saveAs(blob, "Leads.csv");
      //const url= window.URL.createObjectURL(blob);
     // window.open(url);
}

  import_data(){
    this.importPop=true;
    this.upload_body=true;
    this.preview_body=false;
  }

  
  previewImport(){   
    this.preview_loader=true;
    this.validate_fields=[];
    this.valid_column=[];
    console.log(this.importArray);
    console.log(this.importColumn);
    this.email_valid=false;
    if(this.importArray.length > 0){
        for(let cpp  of this.importArray){          
            for (const [key, value] of Object.entries(this.importColumn)) {
                  if(cpp[key]==undefined){
                    this.valid_column.push(key);
                  }
                  if(value==true){
                    if(cpp[key]==''){
                      console.log(key,'****'+cpp[key]+'******');
                      this.validate_fields.push(key);
                    }
                  }
                  if(key=='email'){
                    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

                      if (cpp[key] && reg.test(cpp[key]) == false) 
                      {  
                          this.email_valid=true;    
                      }
                  }
            }
         }
         //console.log(this.validate_fields); 
         console.log(this.email_valid);
         if(this.validate_fields.length > 0){
            var uniqueItems = Array.from(new Set(this.validate_fields));
            this.validate_fields=[];
            for(let valid of uniqueItems){
              //var string=valid.replace("_"," ");
              this.validate_fields.push(valid);
              console.log(valid);
            }
           
         } 
         if(this.valid_column.length > 0){
            var uniqueItems = Array.from(new Set(this.valid_column));
            this.valid_column=[];
            for(let valid of uniqueItems){
              //var string=valid.replace("_"," ");
              this.valid_column.push(valid);
            }
          
         }

         console.log(this.validate_fields); 
         console.log(this.valid_column);
        this.upload_body=false;
        this.preview_body=true; 
    }else{
      this.popUpMsg=JSON.stringify('Please choose file to upload');
      this.openDialog();
    }
      setTimeout(()=>{    
              this.preview_loader=false;     
         },1000);
   
  }
 backToImport(){
  this.import_data();
 }
   checkfile(sender) {
     // console.log(sender,'chkfile');
      var validExts = new Array(".csv");
      var fileExt = sender;
      fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
      if (validExts.indexOf(fileExt) < 0) {
        this.popUpMsg=JSON.stringify("Invalid file selected, valid files are of " +
                 validExts.toString() + " types.");
        $(".inputfile").val(null);
        this.openDialog();
        return false;
      }
      else{
        return true;
      }  
}
   onFileSelect(input: HTMLInputElement) {
      this.preview_loader=true;
      const files = input.files;
      //console.log(files);
     // var content = this.csvContent;
     var filecheck=false; 
     if(files && files[0]){
         filecheck=this.checkfile(files[0].name); 

     }
      if (files && files.length && filecheck) {
          const fileToRead = files[0];
          const fileReader = new FileReader();
          fileReader.readAsText(fileToRead, "UTF-8");
          setTimeout(()=>{      
            //  this.importArray=this.msg.onFileLoad(fileReader.result); 
            console.log(fileReader.result); 
              this.importArray=this.csvJSON(fileReader.result);            
               //this.importArray=JSON.parse(this.importArray);
               console.log(this.importArray);
             this.preview_loader=false;   
             $(".inputfile").val(null);                             
         },1000);   
      }else{
          this.preview_loader=false;
      }

    }
    csvJSON(csvText) {
      let lines = [];
      const linesArray = csvText.split('\n');
      // for trimming and deleting extra space 
      linesArray.forEach((e: any) => {
          const row = e.replace(/[\s]+[,]+|[,]+[\s]+/g, ' ').trim();
          lines.push(row);
      });
      // for removing empty record
      lines.splice(lines.length - 1, 1);
      const result = [];
      const headers = lines[0].split(",");

      for (let i = 1; i < lines.length; i++) {
          const obj = {};
          const currentline = lines[i].split(",");
          for (let j = 0; j < headers.length; j++) {
            if(currentline[j]){
               obj[headers[j]] = currentline[j];
             }else{
               obj[headers[j]] = '';
             }
              
          }
          result.push(obj);
      }
      console.log(result);
      return result;
}
importData(){ 
    
    this.dataImport=this.importArray;
   //var data={};
    var data={"results":this.importArray};
    this.leadService.importData(data).subscribe((res:any) => { 
       console.log(res,'import result');
       this.popUpMsg=JSON.stringify(res.message);
       this.importPop=false;
       this.upload_body=false;
       this.preview_body=false;
      this.openDialog();
      this.ngOnInit();
    },error=>{
       console.log(error,'error report');
    });

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
  fieldFilterChangeCustom(id) { 
    this.filterElement.value=''; 
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
           || col.name=='lead_statuses' || col.name=='inclusion_id' || 
           col.name=='task_priorities'
            || col.name=='experience_id' || col.name=='destination_id' || 
            col.name=='itinerary_inclusions'
              || col.name=='sales_stage_id' || col.name=='tag_id'  || 
              col.name=='destinations' ||  col.name =='opportunity_tags' || col.name =='experiences' || 
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
   date_format=false;
  filter_picklist=[];
  picklist_select=false;
  defaultPicklist=false;
  fieldFilterChange(id){
    this.filterElement.value='';
    var field_id=id;
    this.defaultPicklist=false;
    for(let col of this.allColumn){
      //console.log(col);
      if(col.id==field_id){
        console.log(col.alias_name);
        var n = col.alias_name.search("Date");
        if(n > -1){
        console.log('date');
        this.date_format=true;
        this.date_range=true;
        }else{
          console.log('no date');
           this.date_format=false;
            this.date_range=false;
        }
        if(col.alias_name=='Industry'){
          this.filter_picklist=this.industries;
          this.picklist_select=true;
          this.defaultPicklist=true;
        }else if(col.alias_name=='Rating'){
          this.filter_picklist=this.rating;
          this.picklist_select=true;
          this.defaultPicklist=true;

        }else if(col.alias_name=='Lead Status'){
          this.filter_picklist=this.status;
          this.picklist_select=true;
          this.defaultPicklist=true;

        }else if(col.alias_name=='Destination(s)'){
          this.filter_picklist=this.destination;
          this.picklist_select=true;
          this.defaultPicklist=true;
        }else if(col.alias_name=='Salutation'){
          this.filter_picklist=this.salutations;
          this.picklist_select=true;
          this.defaultPicklist=true;
        }else if(col.alias_name=='Created By' || col.alias_name=='Last Modified By'  || col.alias_name=='Owner'){
          this.filter_picklist=this.ownerData;
          this.picklist_select=true;
          this.date_range=false;
          this.defaultPicklist=false;
        }else{
          this.picklist_select=false;
        }
      }
    }
  }
 public extraformModel: any = {};
  customFields:any=[];

  set_extra_field_request(){
    this.customFields=[];
$('.cust_err_frm').html('');
//console.log(this.extraformModel);
var i=0;
    for(let obj in this.extraformModel){
      //this.customFields[i]=[];
      console.log(this.extraformModel[obj]);
      var field_obj=this.extraformModel[obj];
      var value=$("#"+field_obj.name).val();
      var chk_av=$("#"+field_obj.name+"_check").length >0 ?true:false;
      var chk_value=[];
      if(chk_av){
          $("#"+field_obj.name+"_check input:checked").each(function() {
                  chk_value.push($(this).val());
          });
          console.log(chk_value);
          value=chk_value.toString();
      }
      var radio_av=$("#"+field_obj.name+"_radio").length >0 ?true:false;
      
      if(radio_av){
          value='';
          $("#"+field_obj.name+"_radio input:checked").each(function() {
                  value=  $(this).val();
          });
      }
      $("#"+field_obj.name).removeClass('frm-danger');
      if(field_obj.mandatory==1 && value==''){
        $("#"+field_obj.name).addClass('frm-danger');
        $("#"+field_obj.name+"_err_sp").html('This field is Mandatory!');
        this.popUpMsg=JSON.stringify('Please fill all mandatory fields');
        this.openDialog();
        return false;
      }
      var vJson={
      "lead_id":"",
      "lead_additional_field_id" : field_obj.id,
      "field_value" : value?value:'',
      "type" : field_obj.type,
      "type_value" : field_obj.type_value ? field_obj.type_value.toString():''
    };
     // console.log(value); 

      this.customFields.push(vJson);
      //this.customFields[i][key]=value;
    i++;
    }
    console.log(this.customFields);
    this.newContact.custom_fields=this.customFields;
    this.submit_leads();
  }
extraFields:any;
fr_options:any;
  get_additional_fields(){
    this.allExtraFld=[];

    this.formService.getAllfields('Leads').subscribe((data:any)=>{
        console.log(data);  
        this.extraFields=data.additional_fields;
        
for (var i = 0; i <= data.additional_fields.length-1; i++) {
       this.extraformModel[i]=[];
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

        if(data.additional_fields[i].type_value){
          this.fr_options=[];
          //for(let ty of data.additional_field.type_value){
            for (var j = 0; j <= data.additional_fields[i].type_value.length-1; j++) {
            //console.log(data.additional_fields[i].type_value[j]);

            this.fr_options.push({
            id: j + 1,
            value: data.additional_fields[i].type_value[j]
          });

          }
          this.extraFields[i]['options']=this.fr_options;
        }else{
          this.extraFields[i]['options']=[];
        }
        console.log(this.extraFields);
      }
        this.allAdditinalColumn = this.allExtraFld;
      });
  
}

delete_view(viewId){
  var conf=confirm("Are you sure to delete this view?");

  if(conf){
     this.formService.delete_view(viewId,'lead').subscribe((data:any)=>{
      console.log(data);
      this.popUpMsg=JSON.stringify(data);
          this.openDialog();
          this.refreshAccountsGrid();

    });
  }

   
}



  email_error_msg='';
    validateEmail(emailField){
       this.email_error_msg='';
            //console.log(emailField);
            emailField=emailField.target;
             const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
           if (emailField.value && reg.test(emailField.value) == false) 
           {
            //alert('Invalid Email Address');
            this.email_error_msg="Invalid Email Address";
            this.email_error=true;
            return false;
          }else{
            this.email_error_msg=''; 
            this.email_error=false;
          } 
           return true;
    }

    validate_phone(evnt){
      //console.log(evnt.target.value);
      evnt.target.value=evnt.target.value.replace(/[^0-9-]/g, ''); 
      evnt.target.value= evnt.target.value.replace(/(\..*)\./g, '$1');
     return  evnt.target.value;
   }
    closeRightpanel(){
        $('body').removeClass('right-bar-enabled');
        $('body').removeClass('modal-open');
$('body').css('padding-right',0);
        $('.modal-backdrop').remove();
    }
    pinned_view_id:any;
pinned_view(){
  this.pinned_view_id=this.viewId;
   this.leadService.pinned_view(this.viewId).subscribe((data) => {
    console.log(data);
      this.popUpMsg = JSON.stringify(data);
      this.openDialog(); 
      
    });
}
unpinned_view(){
  this.pinned_view_id=0;
   this.leadService.unpinned_view(this.viewId).subscribe((data) => {
    console.log(data);
      this.popUpMsg = JSON.stringify(data);
      this.openDialog(); 
      
    });
}

//additional fields in view
  visibleExtraFileds=[];
  availableExtraFileds=[];
  additinalColumn: any[];
  allAdditinalColumn: Column[];
  display_columns:any[];
  allExtraFld: any[];
  isLocal=true;
  getVisibleAdditionalFields(){
     return (this.additinalColumn) ? this.additinalColumn : [];
  }   
  
  addcolMap = {};
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

  isStandard=false;
  standardFields=[];
  newStAccPop=false;
  formTitle="Add New Lead(standard)";
  st_formType="Lead";
  openStandard_f=false;
    @ViewChild("search_st")
    public searchElementRef_st: ElementRef;  
    public searchControl_st:FormControl;


  openStandard(){
   this.openStandard_f=true;
   this.newStAccPop=true;
     this.searchControl_st = new FormControl();
     setTimeout(()=>{
            this.loadAddressAutocomplete_st();
         },500);
  }

 loadAddressAutocomplete_st(){
       
        this.zoom = 4;
        this.latitude = 39.8282;
        this.longitude = -98.5795;
        this.mapsAPILoader.load().then(() => {  
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef_st.nativeElement, {
            types: ["address"]
          }); 
          autocomplete.addListener("place_changed", () => {
            this.country_name ='';
                this.state_name ='';
                this.city = '';
                this.zip_code = ''; 
            this.ngZone.run(() => {
               let place = autocomplete.getPlace();
               let that=this;
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }else{            

                        that.latitude = place.geometry.location.lat();
                        that.longitude = place.geometry.location.lng();
                        that.zoom = 12;
                        that.fulladdr = place.formatted_address;
                        var street_address="";
                        var street_number="";
                        var street_route=""; 
                        for (var i = 0; i < (place.address_components).length; i++) {
                          if (place.address_components[i].types[0] == 'street_number') {
                            street_number  = place.address_components[i].long_name; 
                          }
                          if (place.address_components[i].types[0] == 'route') { 
                            street_route  = place.address_components[i].long_name; 
                          }
                          if (place.address_components[i].types[0] == 'country') {
                            that.country_name = place.address_components[i].long_name;
                            that.country_code = place.address_components[i].short_name;
                          }
                          if (place.address_components[i].types[0] == "administrative_area_level_1") {
                            that.state_name = place.address_components[i].long_name;
                          }
                          if (place.address_components[i].types[0] == "locality") {
                            that.city = place.address_components[i].long_name;
                          }
                          if (place.address_components[i].types[0] == "postal_code") {
                            that.zip_code = place.address_components[i].long_name;
                          }
                        }
              }
                var street_add=street_number?street_number+' ':'';
                street_address=street_add+street_route; 
                this.newContact.country =this.country_name;
                this.newContact.state =this.state_name;
                this.newContact.city = this.city;
                this.newContact.zip = this.zip_code;
                this.newContact.street = street_address;
            }); 
          });
        });
    }
  picklistValues=[];
  standard_address=false;
  load_form_data(){
    if (this.standardFields && this.standardFields.length > 0) {
      for (let k=0; k < this.standardFields.length;k++) { 
        this.picklistValues.push({'type_value':[{'id':1,"name":"nammmm"}]});

        if(this.standardFields[k].type=='address'){
           this.standard_address=true;
        }
        if(this.standardFields[k].type=='picklist'){      
          let that=this;
          var pick_name=this.get_picklist_name(this.standardFields[k].name);
          this.formService.load_picklist(pick_name).subscribe((data: any) => {
            console.log(k); 
              this.picklistValues[k].type_value=this.setPickDropdown(data,this.standardFields[k].name);
              this.standardFields[k].type_value=this.setPickDropdown(data,this.standardFields[k].name);
              console.log(that.standardFields[k]);  
             
              });  
        }
      } 
    }
  } 
  get_picklist_name(picklist_selected){
    var picklistName='';
     
       if(picklist_selected=='industry_id'){
        picklistName='industries';
       }
       if(picklist_selected=='salutation'){
        picklistName='salutations';
       }
       if(picklist_selected=='rating_id'){
        picklistName='ratings';
       }
       if(picklist_selected=='lead_status_id'){
        picklistName='lead_statuses';
       }
     return picklistName;

  }
  setPickDropdown(data,picklist_selected){ 
    var picklistAllValue=[];
     
       if(picklist_selected=='industry_id'){
        picklistAllValue=data.industries;
       }
       if(picklist_selected=='salutation'){
        picklistAllValue=data.salutations;
       }
       if(picklist_selected=='rating_id'){
        picklistAllValue=data.ratings;
       }
       if(picklist_selected=='lead_status_id'){
        picklistAllValue=data.lead_statuses;
       }
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
       if(picklist_selected=='sales_stage_id'){
        picklistAllValue=data.sales_stages;
       }
       if(picklist_selected=='itinerary_inclusions'){
        picklistAllValue=data.inclusions;
       }
       if(picklist_selected=='tag_id'){
        picklistAllValue=data.opportunity_tags;
       } 


       if(picklist_selected=='opportunity_tags'){
        picklistAllValue=data.opportunity_tags;
       } 
       if(picklist_selected=='destinations'){
        picklistAllValue=data.destinations;
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

}
class Leader{
  "salutation":string;
  "first_name":string;"last_name":string;"lead_status_id":number;
  "company":string;"title":string;"industry_id":number;
  "department":string;"email":string;
  "phone":string;"mobile":string;"dob":string;"website":string;
  "no_employees":number;"rating_id":number;
  "street":string;"city":string;"state":string;"zip":string;"country":string;
  "custom_fields":any;
}