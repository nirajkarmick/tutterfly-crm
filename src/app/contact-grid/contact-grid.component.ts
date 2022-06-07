import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { AccountsMapService } from '../service/accounts-map.service';
import { Router, ParamMap, ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { Column } from './../accounts-grid/column';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { Contact } from './contact';
import { MessageService } from '../message.service';
import { AdminServiceService } from '../service/admin-service.service';
import { MapsAPILoader } from '@agm/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormService } from '../service/form.service';

declare var google;
@Component({ 
  selector: 'app-contact-grid',
  templateUrl: './contact-grid.component.html',
  styleUrls: ['./contact-grid.component.css']
})
export class ContactGridComponent implements OnInit {
  errorMsg: string;
  popUpMsg: string;
  displayedColumns: string[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  countryList: any[];
  stateList: any[];
  cityList: any[];
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
  newContact: Contact = new Contact();
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
  public options: Select2Options;
  allView: any;
  exampleData: any = [];;
  viewId: number = 0;
  filterElement = { "view_id": undefined, "col_name": undefined, "column_id": undefined, "op_name": undefined, "operator_id": undefined, "": undefined, "value": undefined, "is_additional": undefined  };
  filterArray: any[] = [];
  colMap = {};
  opMap = {};
  ownerData: any[] = [];
  aFields: Column[];
  visiFields: Column[];
  reportToLst: any = [];
  accountList: any = [];
  account_owner: string;
  navigationOpen: string;
  curr_page = 2;
  totalData: any;
  totalCurrent = 10;
  popUpClass = false;
  salutations = [{ 'name': 'Mr' }, { 'name': 'Mrs' }];
  @ViewChild("search")
  public searchElementRef: ElementRef;
  public searchControl: FormControl;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public fulladdr: string;
  public country_code: string;
  public state_name: string;
  public city = '';
  public zip_code: string;
  public country_name: string;
  all_view = [];

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

  constructor(private router: Router, private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private contactService: ContactService,
    private acMap: AccountsMapService, private chRef: ChangeDetectorRef,
    public dialog: MatDialog, private msg: MessageService, 
    private admService: AdminServiceService, private formService: FormService) {
    this.account_owner = localStorage.getItem('user');
    this.navigationOpen = this.route.snapshot.queryParams['open'];
    this.msg.sendMessage("contact");

    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 
      ||  location.hostname.search("tnt1")>=0 ||  location.hostname.search("tfc8")>=0 
      ||  location.hostname.search("adrenotravel")>=0
      ||  location.hostname.search("prashtest.")>=0){ 
         this.isLocal=true; 
         this.isStandard=true;
    } 
    this.contactService.reportsToList().subscribe((data: any) => {
      // console.log(data,"REPORTTTTTTTTTTTT");
      this.reportToLst = data.contacts;
      //this.accountList=data.accounts;
      this.salutations = data.salutations;
    });
    this.contactService.getCountryList().subscribe((data: any) => {
      this.countryList = data.countries;
    });
    this.contactService.getAllOperators().subscribe((data: any) => {
      this.allOperators = data.operators;
      for (let a of this.allOperators) {
        this.opMap[a.id] = a.name;
      }
      this.filterElement.operator_id = this.allOperators[0].id;
    });
    this.contactService.getAllColumnList().subscribe((data: any) => {

      this.allColumn = data.contact_all_columns;
      for (let a of this.allColumn) {
        this.colMap[a.id] = a.alias_name;
      }
      this.filterElement.column_id = this.allColumn[0].id;
    });
    this.contactService.setUpAccountsMap().subscribe(data => {
      this.acMap.setUpMaps(data);
      this.accParent = this.acMap.accParentMapData;
      this.accType = this.acMap.accTypeMapData;
      this.rating = this.acMap.ratingsMapData;
      this.industries = this.acMap.industriesMapData;

      this.contactService.getAllClients().subscribe((data: any) => {

        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if (data.contact_views != undefined) {
          this.all_view = data.contact_views;
          for (let e of data.contact_views) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        } else {
          for (let e of data.contact_views) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        }
        setTimeout(() => {
             this.viewId=data.recent_view;
             this.pinned_view_id=data.recent_view;
        this.setUpTableData(data);
        }, 100); 
        this.newContact.owner_id = data.auth_user.id;
        this.navigationOpen = this.route.snapshot.queryParams['open'];
        //alert('hfg');
        if (this.navigationOpen != undefined && this.navigationOpen != null) {console.log('r');
          //setTimeout(()=>{
          this.newAccPop = true;
          $('.right-bar-toggle').trigger('click');
          $('#popNew').trigger('click'); 
          this.popUpClass = true;
          this.newContact.account_id = this.navigationOpen;

          setTimeout(() => {$('#popNew').trigger('click'); 
            this.loadAddressAutocomplete();
            this.fetch_address(this.newContact.account_id);
          }, 500);
          // },2000);


        }
      });
    });

    // this.getSalutations();


    this.get_additional_fields();
    
   
    if(this.isStandard){
      this.contactService.getStandardFileds().subscribe((data: any) => {
        console.log(data);
        this.standardFields = data.standard_fields;
      });
    }

    setTimeout(() => {
            this.load_form_data(); 
    }, 1400); 
  }

  getSalutations() {
    this.admService.getSalutations().subscribe((data: any) => {
      this.salutations = data.salutations;
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
    this.updateColumnData.column_data = this.updateValue;
    this.updateColumnData.contact_id = this.updateColumnData.account_id;
    this.updateColumnData.account_id = undefined;
    this.contactService.updateSingleColumn(this.updateColumnData).subscribe((data) => {
      // console.log(JSON.stringify(data));

      this.popUpMsg = JSON.stringify(data);
      //this.popUpMsg=data.message;
      this.openDialog();
      this.gridData.contacts = [];
      for (let i = 1; i < this.curr_page; i++) {
        setTimeout(() => {
          this.loadMoreAllData(i, this.viewId);
        }, 100);
      }
      //  this.renderNewView(this.viewId);
    });
    this.updateColumnData = {};

  }

  loadMoreAllData(load_page, viewId) {
    if (viewId > 0) {
      this.contactService.fetchView(viewId, load_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationAllData(data);
        }
      });

    } else {
      this.contactService.moreClients(load_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationAllData(data);
        }
      });

    }
    // this.contactService.moreClients(load_page).subscribe((data:any) => {
    //      if(data){
    //        var a_data=data; 
    //        var acc_data=a_data.contacts; 
    //        let that=this;
    //        Object.keys(acc_data).map(function(key) {
    //              that.gridData.contacts.push(acc_data[key]);
    //         });              
    //        this.totalCurrent=this.gridData.contacts.length;
    //        this.dataSource=new MatTableDataSource(this.gridData.contacts);     
    //      } 
    // });
  }
  EditPopHide() {
    this.Editpop = false;
  }

  ngOnInit() {
    this.chRef.detectChanges();
    this.loadPermissionSet();
  }
  view_contact = false;
  create_contact = false;
  download_contact = false;
  edit_contact = false;
  delete_contact = false;
  upload_contact = false;

  loadPermissionSet() {
    if (localStorage.getItem('permissionArray') != null) {
      var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
      if (permissionArray.Contact) {
        console.log(permissionArray.Contact);
        permissionArray.Contact.forEach(permissions => {
          if (permissions.name == 'view_contact') {
            this.view_contact = true;
          }
          if (permissions.name == 'create_contact') {
            this.create_contact = true;
          }
          if (permissions.name == 'edit_contact') {
            this.edit_contact = true;
          }
          if (permissions.name == 'delete_contact') {
            this.delete_contact = true;
          }
          if (permissions.name == 'upload_contact') {
            this.upload_contact = true;
          }
          if (permissions.name == 'download_contact') {
            this.download_contact = true;
          }
        });
      }

    }
    if (this.view_contact == false) {
      //alert('You are not Authorized to view this page!';);
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

 
 createnewStContact(){
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
    this.errorMsg = undefined;
    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();

    } else {
      this.newContact.custom_fields = [];
      this.submit_contact();
    }
  }
  submit_contact() {

    if (!this.newContact.last_name || !this.newContact.account_id) {
      this.name_error = true;
      this.acct_error = true;
      // this.popUpMsg = JSON.stringify('Please fill all mandatory fields');
      // this.openDialog();
      this.popUpMsg = JSON.stringify('Please fill all mandatory fields');
      this.openDialog();
      return;
    }

    if (this.email_error) {
      this.popUpMsg = JSON.stringify('Please fill valid email id!');
      this.openDialog();
      // this.popUpMsg = 'Please fill valid email id!';
      // this.openDialog();
      return;
    }
    this.newContact.documents=this.documentData;
    this.contactService.createClient(this.newContact).subscribe((data: any) => {
      // alert(JSON.stringify(data));
      if (!data.error) {
        this.checkCurrentView();
        this.opennewContactPop();
        this.newContact = new Contact();
        $('body').removeClass('modal-open');
$('body').css('padding-right',0);
        $('.modal-backdrop').remove();
        this.newStAccPop=false;
      }
      this.name_error = false;
      this.acct_error = false;
      this.popUpMsg = JSON.stringify(data);

      this.openDialog();
    });

  }
  refreshAccountsGrid() {
    this.gridData = undefined;
    this.viewId = 0;


    this.contactService.setUpAccountsMap().subscribe(data => {
      this.acMap.setUpMaps(data);
      this.accParent = this.acMap.accParentMapData;
      this.accType = this.acMap.accTypeMapData;
      this.rating = this.acMap.ratingsMapData;
      this.industries = this.acMap.industriesMapData;
      this.contactService.getAllClients().subscribe((data: any) => {
        this.exampleData = [];
        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if (data.contact_views != undefined) {
          this.all_view = data.contact_views;
          for (let e of data.contact_views) {
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

  fetch_address(id) {
    this.contactService.fetch_address(id).subscribe((data: any) => {
      console.log(data);
      if (data && data.account) {
        this.newContact.mailing_country = data.account.billing_country;
        this.newContact.mailing_state = data.account.billing_state;
        this.newContact.mailing_city = data.account.billing_city;
        this.newContact.mailing_zip = data.account.billing_zip;
        setTimeout(() => {
          $('#street_add').val(data.account.billing_street);
        }, 1000);

        this.account_nameSearch = data.account.name;

      }

    });
  }
  autoAccList = [];
  account_nameSearch: any;
  search_acc(evnt) {
    this.autoAccList = [];
    var val = evnt.target.value;

    if (val.length > 2) {
      console.log(val);
      this.contactService.searh_account(val).subscribe((data: any) => {
        console.log(data);
        if (data && data.accounts) {
          this.autoAccList = data.accounts;
        } else {
          this.autoAccList = [];
        }


      });
    } else {
      this.autoAccList = [];
    }

  }
  fetch_acc(id, name) {
    console.log(id);
    this.fetch_address(id);
    this.autoAccList = [];
    this.newContact.account_id = id;
    this.account_nameSearch = name;
  }
  renderNewView(viewId: any) {
    if (viewId != 0) {
      this.viewId = viewId;
      this.gridData = undefined;
      this.chRef.detectChanges();
      this.contactService.setUpAccountsMap().subscribe(data => {
        this.acMap.setUpMaps(data);
        this.accParent = this.acMap.accParentMapData;
        this.accType = this.acMap.accTypeMapData;
        this.rating = this.acMap.ratingsMapData;
        this.industries = this.acMap.industriesMapData;
        this.contactService.fetchView(viewId, 0).subscribe((data: any) => {
          this.filterArray = data.contact_filters;
          this.sviewVisibility = data.contact_view.public_view;
          console.log(this.sviewVisibility);
          // this.contactService.getAllClients().subscribe((data: any) => {
          //   this.exampleData=[];
          //   this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
          //   if (data.contact_views != undefined) {
          //     for (let e of data.contact_views) {
          //       this.exampleData.push({ "id": e.id, "text": e.name });
          //     }
          //   } 
          //   this.viewId = viewId;
          // });

          this.setUpTableData(data);
          this.totalCurrent = 10;
          this.curr_page = 2;
        });
      });
    } else {
      this.refreshAccountsGrid();
    }
  }
  renameView() {
    if ((this.sviewName != undefined) && (this.sviewName != null) && (this.sviewName.trim() != "")) {
      this.contactService.rename(this.viewId, this.sviewName).subscribe((data: any) => {
        this.exampleData = [];
        this.chRef.detectChanges();
        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if (data.contact_views != undefined) {
          this.all_view = data.contact_views;
          for (let e of data.contact_views) {
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
  saveView() {

    this.contactService.createView(this.sviewName, this.sviewVisibility).subscribe(((data: any) => {
      this.refreshAccountsGrid();
      this.renderNewView(data.contact_view.id);
      setTimeout(() => {
        this.viewId = data.contact_view.id;
      }, 1500);
    }));

  }
  renameModel() {
    //alert(this.viewId);
    //console.log(this.all_view);
    if (this.all_view != undefined) {
      for (let vew of this.all_view) {
        if (vew.id == this.viewId) {
          this.sviewName = vew.name;
        }
      }
    }
  }
  checkCurrentView() {
    if (this.viewId != undefined && this.viewId != 0) {
      this.renderNewView(this.viewId);
    } else {
      this.refreshAccountsGrid();
    }
  }
  setUpTableData(data: any) {
  $('body').removeClass('modal-open');
$('body').css('padding-right',0);
  $('.modal-backdrop').remove();
    this.displayedColumns = [];
    this.gridData = data;
    if (this.gridData.users != undefined) {
      this.ownerData = this.gridData.users;
    }
    this.totalData = data.total;

    this.dataSource = new MatTableDataSource(this.gridData.contacts);
    this.columns = this.gridData.display_columns;
        this.display_columns = this.gridData.display_columns;
        var j=0;
        for (let c of this.columns) {
          this.displayedColumns.push(c.name);
          j++;
        } 
    var display_columns=[];
    if(this.isLocal){      
      this.additinalColumn = this.gridData.display_additional_columns;
      var add_fileds=this.additinalColumn;      
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
      }
    }
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
  loadMoreData(viewId) {
    // this.contactService.moreClients(this.curr_page).subscribe((data:any) => {
    //      if(data){
    //        var a_data=data; 
    //        var acc_data=a_data.contacts; 
    //        let that=this;
    //        Object.keys(acc_data).map(function(key) {
    //              that.gridData.contacts.push(acc_data[key]);
    //         });              
    //        this.totalCurrent=this.gridData.contacts.length;
    //        this.dataSource=new MatTableDataSource(this.gridData.contacts); 
    //        this.curr_page=parseInt(a_data.pagination.current_page) + 1;   
    //        console.log(this.curr_page);      
    //      } 
    // });

    if (viewId > 0) {
      this.contactService.fetchView(viewId, this.curr_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationData(data);
        }
      });

    } else {
      this.contactService.moreClients(this.curr_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationData(data);
        }
      });

    }
  }
  setPaginationData(data) {
    var a_data = data;
    var acc_data = a_data.contacts;
    let that = this;
    Object.keys(acc_data).map(function (key) {
      that.gridData.contacts.push(acc_data[key]);
    });
    this.totalCurrent = this.gridData.contacts.length;
    this.dataSource = new MatTableDataSource(this.gridData.contacts);

    this.curr_page = parseInt(a_data.pagination.current_page) + 1;

  }
  setPaginationAllData(data) {
    var a_data = data;
    var acc_data = a_data.contacts;
    let that = this;
    Object.keys(acc_data).map(function (key) {
      that.gridData.contacts.push(acc_data[key]);
    });
    this.totalCurrent = this.gridData.contacts.length;
    this.dataSource = new MatTableDataSource(this.gridData.contacts);

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
        // alert('Please select a view(Filter cannot be used on default view)');
        this.popUpMsg = JSON.stringify('Please select a view(Filter cannot be used on default view)');
        this.openDialog();
      }
    } catch (e) {
      // alert('Please select a view(Filter cannot be used on default view)');

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
    this.contactService.saveFilter(this.filterArray).subscribe(data => {
      console.log("save " + JSON.stringify(data));
      this.renderNewView(this.viewId);
    });
    this.filterElement.view_id = undefined;
    this.filterArray = [];

  }

  getAvailableFields() {
    let col: Column[] = [];

    for (let c1 of this.allColumn) {
      let flag = true;
      for (let c of this.columns) {
        if (c.id == c1.id || c1.name == 'tenant_id') {
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
      this.contactService.updateView(this.viewId, col_list).subscribe(data => { 
        this.popUpMsg = JSON.stringify(data);
        this.openDialog();

                  if(this.isLocal){
                        
                        let add_list = [];
                        for (let a of this.additinalColumn) {
                          add_list.push(a.id);
                        }
                        this.contactService.updateAdditionalView(this.viewId, add_list).subscribe(datas => {
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
    this.autoAccList = [];
    this.account_nameSearch = '';
    this.searchControl = new FormControl();
    setTimeout(() => {
      this.loadAddressAutocomplete();
    }, 500);
  }
  loadAddressAutocomplete() {

    this.zoom = 4;
    this.latitude = 39.8282;
    this.longitude = -98.5795;
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.country_name = '';
        this.state_name = '';
        this.city = '';
        this.zip_code = '';
        this.ngZone.run(() => {
          let place = autocomplete.getPlace();
          let that = this;
          if (place.geometry === undefined || place.geometry === null) {
            return;
          } else {

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
          this.newContact.mailing_country = this.country_name;
          this.newContact.mailing_state = this.state_name;
          this.newContact.mailing_city = this.city;
          this.newContact.mailing_zip = this.zip_code;
          this.newContact.mailing_street = street_address;
          // alert('d');
        });
      });
    });
  }

  /*New contact pop show*/
  newAccPop: boolean = false;
  opennewContactPop() {
    this.newAccPop = !this.newAccPop;
  }

  fetchState() {
    this.contactService.getStateList(Number(JSON.parse(this.newContact.mailing_country).id)).subscribe((data: any) => {
      this.stateList = data.states;
    });
  }

  fetchCity() {
    this.contactService.getCityList(Number(JSON.parse(this.newContact.mailing_state).id)).subscribe((data: any) => {
      this.cityList = data.cities;
    });
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
  updateViewVisibility() {
    if (this.sviewVisibility != undefined && this.sviewVisibility != null) {
      this.contactService.viewVisibilityUpdate(this.viewId, this.sviewVisibility).subscribe((data: any) => {
        this.popUpMsg = JSON.stringify(data);
        this.openDialog();
      });
    } else {
      this.popUpMsg = JSON.stringify({ "message": "Please select an option" });
      this.openDialog();

    }
  }
  templates: any[];
  selectedTemplate =
    {
      id: '',
      subject: "",
      body: "",
      name: ''
    };
  viewName: any;
  fetchMailMeta() {
    this.contactService.getMassMailMeta(this.viewId).subscribe((data: any) => {
      this.templates = data.email_templates;
      this.viewName = data.contact_view;
    })
  }
  sendMassMail() {
     this.popUpMsg = JSON.stringify('Your bulk email has not been activated yet!.Please contact TutterflyCRM team to activate bulk mail!');
      this.openDialog();
      return;
    let send = {
      view_id: this.viewName.id,
      from_address: localStorage.getItem('fromMail'),
      to_address: this.viewName.name,
      subject: this.selectedTemplate.subject,
      description_html: this.selectedTemplate.body,
      email_template: this.selectedTemplate.id
    }

    this.contactService.sendMassMail(send).subscribe((data: any) => {
      this.popUpMsg = JSON.stringify(data);
      this.openDialog();
    })

  }
  sTemplate: any
  change() {
    for (let i = 0; i < this.templates.length; i++) {
      if (this.templates[i].id == this.sTemplate) {
        //this.selectedTemplate=JSON.parse(this.templates[i]+"");
        this.selectedTemplate = this.templates[i];
        console.log(this.selectedTemplate);
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
  reportToDetails(id: any) {
    for (let rep of this.reportToLst) {
      if (rep.id == id) {
        return rep.first_name + ' ' + rep.last_name;
      }

    }
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
        console.log(col);
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
              || col.name=='sales_stage_id' || col.name=='tag_id' || 
              col.name=='destinations'  ||  col.name =='opportunity_tags' || col.name =='experiences' || 
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
  date_format = false;
  filter_picklist=[];
  picklist_select=false;
  fieldFilterChange(id) { 
    var field_id = id;
    for (let col of this.allColumn) {
      //console.log(col);
      if (col.id == field_id) {
        console.log(col.alias_name);
        var n = col.alias_name.search("Date");
        if (n > -1) {
          console.log('date');
          this.date_format = true;
          this.date_range=true;
          this.picklist_select=false;
        } else {
          console.log('no date');
          this.date_format = false;
          this.date_range=false;
        }

        if(col.alias_name=='Created By' || col.alias_name=='Last Modified By'  || col.alias_name=='Owner'){
          this.filter_picklist=this.ownerData;
          this.picklist_select=true;
          this.date_range=false;
        //this.defaultPicklist=false;
        }
      }
    }
  }
  public extraformModel: any = {};
  customFields: any = [];
  set_extra_field_request() {
    this.customFields = [];
    var i = 0;
    $('.cust_err_frm').html('');
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
        "contact_id": "",
        "contact_additional_field_id": field_obj.id,
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
    this.newContact.custom_fields = this.customFields;
    console.log(this.newContact);
    this.submit_contact();
  }

  extraFields: any;
  fr_options: any;
  get_additional_fields() {
    this.allExtraFld=[]; 

    this.formService.getAllfields('Contact').subscribe((data: any) => {
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
  delete_view(viewId) {
    var conf = confirm("Are you sure to delete this view?");

    if (conf) {
      this.formService.delete_view(viewId, 'contact').subscribe((data: any) => {
        console.log(data);
        this.popUpMsg = JSON.stringify(data);
        this.openDialog();
        this.refreshAccountsGrid();

      });
    }

  }


  accType_error = false;
  email_error = false;
  email_error_msg = '';
  validateEmail(emailField) {
    this.email_error_msg = '';
    //console.log(emailField);
    emailField = emailField.target;
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (emailField.value && reg.test(emailField.value) == false) {
      //alert('Invalid Email Address');
      this.email_error_msg = "Invalid Email Address";
      this.email_error = true;
      return false;
    } else {
      this.email_error_msg = '';
      this.email_error = false;
    }
    return true;
  }

  validate_phone(evnt) {
    //console.log(evnt.target.value);
    evnt.target.value = evnt.target.value.replace(/[^0-9-]/g, '');
    evnt.target.value = evnt.target.value.replace(/(\..*)\./g, '$1');
    return evnt.target.value;
  }
pinned_view_id:any;
pinned_view(){
  this.pinned_view_id=this.viewId;
   this.contactService.pinned_view(this.viewId).subscribe((data) => {
    console.log(data);
      this.popUpMsg = JSON.stringify(data);
      this.openDialog(); 
      
    });
}
unpinned_view(){
  this.pinned_view_id=0;
   this.contactService.unpinned_view(this.viewId).subscribe((data) => {
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
  formTitle="Add New Contact(standard)";
  st_formType="Contact";
  openStandard_f=false;
    @ViewChild("search_st")
    public searchElementRef_st: ElementRef;  
    public searchControl_st:FormControl;


  openNewAccountPopSt(){
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
                this.newContact.mailing_country = this.country_name;
                this.newContact.mailing_state = this.state_name;
                this.newContact.mailing_city = this.city;
                this.newContact.mailing_zip = this.zip_code;
                this.newContact.mailing_street = street_address;
            }); 
          });
        });
    }
  picklistValues=[];
  standard_address=false;
  load_form_data(){
    if (this.standardFields && this.standardFields.length > 0) {
      for (let k=0; k < this.standardFields.length;k++) { 

        if(this.standardFields[k].type=='address'){
           this.standard_address=true;
        }
        if(this.standardFields[k].type=='picklist'){      
          let that=this;
          var pick_name=this.get_picklist_name(this.standardFields[k].name);
          this.formService.load_picklist(pick_name).subscribe((data: any) => {
            console.log(k); 
             // this.picklistValues[k].type_value=this.setPickDropdown(data,this.standardFields[k].name);
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
       if(picklist_selected=='destinations'){
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
