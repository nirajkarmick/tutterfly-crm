import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core';
import { SupplierService } from '../service/supplier.service';
import { AccountsMapService } from '../service/accounts-map.service';
import { Router, ParamMap } from '@angular/router';
import * as $ from 'jquery';
import { Account } from './account';
import { Column } from './column';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { MessageService } from '../message.service';
import { environment } from "../../environments/environment";
import { MapsAPILoader } from '@agm/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material';
import { FormService } from '../service/form.service';
import { OppurtunityService } from '../service/opportunity.service';

declare var google;
declare var gapi: any;
 
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [SupplierService]
})
export class SupplierComponent implements OnInit {
  popUpMsg: string;
  displayedColumns: string[] = [];
  displayedAdditionalColumns:string[]=[];
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
  newAccount: Account = new Account();
  allOperators: any;
  allColumn: Column[]; 
  columns: Column[];
  display_columns:any[];
  selectedColumn: string;
  dest_error = false;
  updateColumnData: any = {
    supplier_id: undefined,
    column_id: undefined,
    column_data: undefined
  };
  updateValue: string;
  public options: Select2Options;
  allView: any;
  exampleData: any = [];
  viewId: number = 0;
  filterElement = { "view_id": undefined, "col_name": undefined, "column_id": undefined, "op_name": undefined, "operator_id": undefined, "": undefined, "value": undefined , "is_additional": undefined };
  filterArray: any[] = [];
  colMap = {};
  opMap = {};
  ownerData: any[] = [];
  aFields: Column[];
  visiFields: Column[];
  curr_page = 2;
  totalData: any;
  totalCurrent = 10;
  add_btn_show = false;
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

  importPop = false;
  csvContent: string;
  parsedCsv: any;
  importArray: any = [];
  extData: any;
  upload_body: any;
  preview_body: any;
  isLocal=true;
  sup_services:any=[];
  supplier_types:any=[];
  allDestinations: any = [];
  allServices: any = [];
  data_destinations:any=[];
  data_services:any=[];
  public destOptions: Select2Options;

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

  constructor(private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private accountServiceService: SupplierService,
    private acMap: AccountsMapService, private chRef: ChangeDetectorRef,
    public dialog: MatDialog,private opportunitieservice: OppurtunityService, private msg: MessageService, private formService: FormService
    //, private environment:environment
  ) {

    if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 
      ||  location.hostname.search("tnt1")>=0 ||  location.hostname.search("tfc8")>=0){ 
         this.isLocal=false; 
         this.isStandard=false;
    } 
    //  console.log(environment.current_url);
    this.checkPermission();

    this.searchControl = new FormControl();
    this.newAccount.supplier_owner = localStorage.getItem('user');  
     this.destOptions = {
            width: '100%',
            multiple: true,
            // tags: true
        };
    this.msg.sendMessage("supp");
    this.accountServiceService.getCountryList().subscribe((data: any) => {
      this.countryList = data.countries;
    });
    this.accountServiceService.getAllOperators().subscribe((data: any) => {
      this.allOperators = data.operators;
      for (let a of this.allOperators) {
        this.opMap[a.id] = a.name;
      }
      this.filterElement.operator_id = this.allOperators[0].id;
    });
    this.accountServiceService.getAllColumnList().subscribe((data: any) => {

      this.allColumn = data.account_all_columns;
      for (let a of this.allColumn) {
        this.colMap[a.id] = a.alias_name;
      }
      this.filterElement.column_id = this.allColumn[0].id;
    });
    this.accountServiceService.setUpAccountsMap().subscribe((data:any) => {
      this.acMap.setUpMaps(data);
      this.accParent = this.acMap.accParentMapData;
      //console.log(this.accParent);
      this.accType = this.acMap.accTypeMapData;
      this.rating = this.acMap.ratingsMapData;
      this.industries = this.acMap.industriesMapData;
      this.sup_services = data.supplier_services;
      this.supplier_types = data.supplier_types;
      this.allDestinations=[];
      this.allServices=[];
        if(data && data.destinations!=undefined){
          //this.data_destinations=data.destinations;
          console.log(this.data_destinations);
          for(let destin of data.destinations){ 
            this.data_destinations.push({ "id": destin.id, "name": destin.name});
             this.allDestinations.push({ "id": destin.id, "text": destin.name+ ', ' +destin.country_name});
          }
        }  

        if(data && data.supplier_services!=undefined){
          for(let serv of data.supplier_services){ 
          this.data_services.push({ "id": serv.id, "name": serv.name });
             this.allServices.push({ "id": serv.id, "text": serv.name });
          }
        }   
      this.accountServiceService.getAllAccounts().subscribe((data: any) => {

        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if (data.supplier_views != undefined) {
          for (let e of data.supplier_views) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        } else {
          for (let e of data.account_view) {
            this.exampleData.push({ "id": e.id, "text": e.name });
          }
        }
        setTimeout(() => {
             this.viewId=data.recent_view;
             this.pinned_view_id=data.recent_view;
        }, 400); 
        this.setUpTableData(data);
      });
    });

    //custom additional fields
    this.get_additional_fields();
    if(this.isStandard){
      // this.accountServiceService.getStandardFileds().subscribe((data: any) => {
      //   console.log(data);
      //   this.standardFields = data.standard_fields;
      // });
    }

    setTimeout(() => {
            this.load_form_data(); 
    }, 1400);  
  }


  export_data() {
  }

  import_data() {
    this.importPop = true;
    this.upload_body = true;
    this.preview_body = false;
  }



  autoAccList = [];
  account_nameSearch: any;
  search_acc(evnt) {
    this.autoAccList = [];
    var val = evnt.target.value;

    console.log(val.length);
    if(val.length>2){
      this.accountServiceService.searh_account(val).subscribe((data: any) => {
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
  fetch_acc(id, name) {
    console.log(id);
    this.autoAccList = [];
    this.newAccount.acc_parent_id = id;
    this.account_nameSearch = name;
  }
  previewImport() {
    console.log(this.importArray);
    console.log(this.extData);
    if (this.importArray.length > 0) {
      this.upload_body = false;
      this.preview_body = true;
    } else {
      this.popUpMsg = JSON.stringify('Please choose file to upload');
      this.openDialog();
    }
  }

  onFileSelect(input: HTMLInputElement) {

    const files = input.files;
    var content = this.csvContent;
    if (files && files.length) {
      const fileToRead = files[0];
      const fileReader = new FileReader();
      fileReader.onload = this.onFileLoad;
      fileReader.readAsText(fileToRead, "UTF-8");
    }

  }
  onFileLoad(fileLoadedEvent) {
    const csvSeparator = ';';
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
    let data = textFromFileLoaded;

    // Retrieve the delimeter
    const delimeter = ',';

    // initialize variables
    var newline = '\n';
    var eof = '';
    var i = 0;
    var c = data.charAt(i);
    var row = 0;
    var col = 0;
    var array = new Array();

    while (c != eof) {
      // skip whitespaces
      while (c == ' ' || c == '\t' || c == '\r') {
        c = data.charAt(++i); // read next char
      }

      // get value
      var value = "";
      if (c == '\"') {
        // value enclosed by double-quotes
        c = data.charAt(++i);

        do {
          if (c != '\"') {
            // read a regular character and go to the next character
            value += c;
            c = data.charAt(++i);
          }

          if (c == '\"') {
            // check for escaped double-quote
            var cnext = data.charAt(i + 1);
            if (cnext == '\"') {
              // this is an escaped double-quote. 
              // Add a double-quote to the value, and move two characters ahead.
              value += '\"';
              i += 2;
              c = data.charAt(i);
            }
          }
        }
        while (c != eof && c != '\"');

        if (c == eof) {
          throw "Unexpected end of data, double-quote expected";
        }

        c = data.charAt(++i);
      }
      else {
        // value without quotes
        while (c != eof && c != delimeter && c != newline && c != ' ' && c != '\t' && c != '\r') {
          value += c;
          c = data.charAt(++i);
        }
      }

      // add the value to the array
      if (array.length <= row)
        array.push(new Array());
      array[row].push(value);

      // skip whitespaces
      while (c == ' ' || c == '\t' || c == '\r') {
        c = data.charAt(++i);
      }

      // go to the next row or column
      if (c == delimeter) {
        // to the next column
        col++;
      }
      else if (c == newline) {
        // to the next row
        col = 0;
        row++;
      }
      else if (c != eof) {
        // unexpected character
        throw "Delimiter expected after character " + i;
      }

      // go to the next character
      c = data.charAt(++i);
    }

    console.log(array);
    let ct = 0;
    for (let arr of array) {
      if (ct > 0) {
        let pt = 0;
        for (let cpp of arr) {
          // this.importArray[ct][array[0][pt]]=cpp;
          array[ct][array[0][pt]] = cpp;
          delete array[ct][pt];
          pt++
        }
      }
      ct++;
    }
    setTimeout(() => {
      this.importArray = array;
      this.extData = 'gdfgdgdg';
      console.log(this.importArray);
      // this.previewImport();
    }, 1000);

  }
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg,
      // position: {
      //   bottom: '10px',
      //   left: '0px'
      // }
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {

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
    this.updateColumnData.supplier_id = account_id;
    this.updateValue = defaultV;
    this.Editpop = true;
  }
  updateColumn() {
    //alert(this.updateColumnData.column_id);
    this.updateColumnData.column_data = this.updateValue;
    if (this.updateColumnData.column_id == 2) {
      //alert((this.updateColumnData.updateValue).match(/^[0-9]+$/));
      if (!isNaN(this.updateColumnData.updateValue)) {
        // alert('please input phone number');
        // return false;         
      }
      //return false;
    }
    this.accountServiceService.updateSingleColumn(this.updateColumnData).subscribe((data) => {
      this.popUpMsg = JSON.stringify(data);
      this.openDialog();
      this.gridData.accounts = [];
      let c_no = this.curr_page;
      //alert(c_no);
      for (let i = 1; i < c_no; i++) {
        setTimeout(() => {
          this.loadMoreAllData(i, this.viewId);
        }, 100);

      }
      //this.renderNewView(this.viewId);
    });
    this.updateColumnData = {};

  } 
  EditPopHide() {
    this.Editpop = false;
  }

  ngOnInit() {
    this.chRef.detectChanges();
    this.loadPermissionSet();
  }
  view_account = false;
  create_account = false;
  download_account = false;
  edit_account = false;
  delete_account = false;
  upload_account = false;


  loadPermissionSet() {
    if (localStorage.getItem('permissionArray') != null) {
      var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
      if (permissionArray.Account) {
        console.log(permissionArray.Account);
        permissionArray.Account.forEach(permissions => {

          if (permissions.name == 'view_account') {
            this.view_account = true;
          }
          if (permissions.name == 'create_account') {
            this.create_account = true;
          }
          if (permissions.name == 'edit_account') {
            this.edit_account = true;
          }
          if (permissions.name == 'delete_account') {
            this.delete_account = true;
          }
          if (permissions.name == 'upload_account') {
            this.upload_account = true;
          }
          if (permissions.name == 'download_account') {
            this.download_account = true;
          }
        });
      }

    }
    if (this.view_account == false) {
      //alert('You are not Authorized to view this page!';);
      this.popUpMsg = 'You are not Authorized to view this page!';
      this.openDialog();
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['Dashboard'] } }]);

    }
  }
  getKeys(map: any) {
    let arr: any[] = [];
    for (let k in map) {
      arr.push(k);
    }
    return arr;
  }

  name_error = false;
  accType_error = false;
  email_error = false;

 createnewStAccount(){
  if(this.checkStandardFiledValidation()==false){
      console.log('ff')
      return false;
    }
    
    console.log(this.newAccount);
    //return false;

    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();
    } else {
      this.newAccount.custom_fields = [];
      this.createNewAccount();
    }
  }
  checkStandardFiledValidation(){
    var standard_error=false; 
    for (let st_fld of this.standardFields) {
       if(st_fld.mandatory==1 && this.newAccount[st_fld.name]==undefined){
            

      console.log(this.newAccount[st_fld.name],st_fld.name+'--MAN--'+st_fld.mandatory);
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


  createNewAccount() {
    //this.submit_account();
    if (this.extraFields && this.extraFields.length > 0) {
      this.set_extra_field_request();
    } else {
      this.newAccount.custom_fields = [];
      this.submit_account();
    }
  }
  supp_type_err=false;
  submit_account() {
      this.name_error = false; 
      this.email_error = false; 
      this.supp_type_err = false; 
    if (!this.newAccount.name) {
      this.name_error = true; 
      this.popUpMsg = JSON.stringify('Please fill Supplier Name');
      this.openDialog();
      return;
    }
if (!this.newAccount.supplier_type_id) {
      this.supp_type_err = true; 
      this.popUpMsg = JSON.stringify('Please select supplier type');
      this.openDialog();
      return;
    }

if (!this.newAccount.email) {
      this.email_error = true; 
      this.popUpMsg = JSON.stringify('Please fill valid email');
      this.openDialog();
      return;
    }

    if (this.email_error) {
      this.popUpMsg = JSON.stringify('Please fill valid email id!');
      this.openDialog();
      return;
    }
    this.newAccount.rate_list_links=this.price_link;
    this.newAccount.countries=this.selectedCountryinationArray;
    this.newAccount.destinations=this.selectedDestinationArray;
    this.newAccount.documents=this.documentData;
    this.accountServiceService.createClient(this.newAccount).subscribe((data: any) => {
      console.log(JSON.stringify(data));
      if (!data.error) {
        this.checkCurrentView();
        this.openNewAccountPop(); 
        $('modal').hide;
        this.newAccount.clear();
        $('body').removeClass('modal-open');
$('body').css('padding-right',0);
        $('.modal-backdrop').remove();
        this.newStAccPop=false;
      }
      this.popUpMsg = JSON.stringify(data);
      this.openDialog();

    });

  }
price_link=[{'link':''}];
//price_link=[''];
addMorePrice(){
  var p_length=this.price_link.length;
  this.price_link.push({'link':''});
  //this.price_link.push('');
}
removePrice(i){ 
  console.log(this.price_link); 
    this.price_link.splice(i, 1);
}
  selectedDestin(dest_idd:any){
    this.newAccount.destination=dest_idd;
    console.log(this.newAccount.destination);
  }


  selectedServices(serv_idd:any){
    this.newAccount.supplier_services_id=serv_idd;
    console.log(this.newAccount.supplier_services_id);
  }
 
  public extraformModel: any = {};
  customFields: any = [];
  set_extra_field_request() {


    this.customFields = [];
    $('.cust_err_frm').html('');

    var i = 0;
    for (let obj in this.extraformModel) {
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
        this.popUpMsg = JSON.stringify('Please fill all mandatory fields..');
        this.openDialog();
        return false;
      }
      var vJson = {
        "supplier_id": "",
        "supplier_additional_field_id": field_obj.id,
        "field_value": value ? value : '',
        "type": field_obj.type,
        "type_value": field_obj.type_value ? field_obj.type_value.toString() : ''
      };
      this.customFields.push(vJson);
      console.log(this.customFields);
      i++;
    }
    console.log(this.customFields);
    this.newAccount.custom_fields = this.customFields;
    console.log(this.newAccount);
    this.submit_account();

  }
  refreshAccountsGrid() {
    this.selectedCountryinationArray=[];
    this.selectedDestinationArray=[];
    this.gridData = undefined;
    this.viewId = 0;

    this.accountServiceService.setUpAccountsMap().subscribe(data => {
      this.acMap.setUpMaps(data);
      this.accParent = this.acMap.accParentMapData;
      this.accType = this.acMap.accTypeMapData;
      this.rating = this.acMap.ratingsMapData;
      this.industries = this.acMap.industriesMapData;
      this.accountServiceService.getAllAccounts().subscribe((data: any) => {
        this.exampleData = [];
        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if (data.supplier_views != undefined) {
          for (let e of data.supplier_views) {
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
    if (viewId != 0 && viewId != undefined) {
      this.curr_page = 2; 
      this.viewId = viewId;
      this.gridData = undefined;
      this.chRef.detectChanges();
      this.accountServiceService.setUpAccountsMap().subscribe(data => {
        this.acMap.setUpMaps(data);
        this.accParent = this.acMap.accParentMapData;
        this.accType = this.acMap.accTypeMapData;
        this.rating = this.acMap.ratingsMapData;
        this.industries = this.acMap.industriesMapData;
        console.log(this.viewId);

        this.accountServiceService.fetchView(viewId, 0).subscribe((datas: any) => {
          this.filterArray = datas.supplier_filters;
          this.sviewVisibility = datas.account_view.public_view;
          //console.log(this.sviewVisibility);

          // this.accountServiceService.getAllAccounts().subscribe((data: any) => {
          //   this.exampleData=[];
          //   this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
          //   if (data.supplier_views != undefined) {
          //     for (let e of data.supplier_views) {
          //       this.exampleData.push({ "id": e.id, "text": e.name });
          //     }
          //   } 
          //   this.viewId = viewId;
          // });
          console.log(datas.display_columns); 
          this.setUpTableData(datas);
          this.totalCurrent = 10;
          this.curr_page = 2;
        });
      });
    } else {
      this.refreshAccountsGrid();
    }
  }
  saveView() {
    this.accountServiceService.createView(this.sviewName, this.sviewVisibility).subscribe(((data: any) => {
      this.refreshAccountsGrid();
      this.renderNewView(data.account_view.id);
      setTimeout(() => {
        this.viewId = data.account_view.id;
      }, 2500);
    }));

  }
  checkCurrentView() {
    this.curr_page = 2;
    if (this.viewId != undefined && this.viewId != 0) {
      this.renderNewView(this.viewId);
    } else {
      this.refreshAccountsGrid();
    }
  }
  setUpTableData(data: any) {
    this.displayedColumns = [];
    this.displayedAdditionalColumns=[];
    this.gridData = data;
    if (this.gridData.users != undefined) {
      this.ownerData = this.gridData.users;
    }
    this.totalData = data.total;
    this.dataSource = new MatTableDataSource(this.gridData.accounts);
    this.columns = this.gridData.display_columns;
    console.log(this.gridData);
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
      }
    }
   
    this.display_columns= this.display_columns.concat(display_columns); 
  } 
    //return false;  
    this.chRef.detectChanges();
    if (this.dataSource.paginator == undefined) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // this.dataSource.paginator=page;

    this.chRef.detectChanges();

  }
  loadMoreData(viewId) {
    if (viewId > 0) {
      this.accountServiceService.fetchView(viewId, this.curr_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationData(data);
        }
      });

    } else {
      this.accountServiceService.moreAccounts(this.curr_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationData(data);
        }
      });

    }
  }
  loadMoreAllData(load_page, viewId) {
    if (viewId > 0) {
      this.accountServiceService.fetchView(viewId, load_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationAllData(data);
        }
      });

    } else {
      this.accountServiceService.moreAccounts(load_page).subscribe((data: any) => {
        if (data) {
          this.setPaginationAllData(data);
        }
      });

    }

    // this.accountServiceService.moreAccounts(load_page).subscribe((data:any) => {
    //      if(data){
    //        var a_data=data; 
    //        var acc_data=a_data.accounts; 
    //        let that=this;
    //        Object.keys(acc_data).map(function(key) {
    //              that.gridData.accounts.push(acc_data[key]);
    //         });              
    //        this.totalCurrent=this.gridData.accounts.length;
    //        this.dataSource=new MatTableDataSource(this.gridData.accounts); 
    //      } 
    // });
  }
  setPaginationData(data) {
    var a_data = data;
    var acc_data = a_data.accounts;
    let that = this;
    Object.keys(acc_data).map(function (key) {
      that.gridData.accounts.push(acc_data[key]);
    });
    this.totalCurrent = this.gridData.accounts.length;
    this.dataSource = new MatTableDataSource(this.gridData.accounts);

    this.curr_page = parseInt(a_data.pagination.current_page) + 1;

  }
  setPaginationAllData(data) {
    var a_data = data;
    var acc_data = a_data.accounts;
    let that = this;
    Object.keys(acc_data).map(function (key) {
      that.gridData.accounts.push(acc_data[key]);
    });
    this.totalCurrent = this.gridData.accounts.length;
    this.dataSource = new MatTableDataSource(this.gridData.accounts);
  }
  dtDisable = true;
  AddFilterElement() {
  this.rep_filter_msg="";

    try {
      if (this.viewId != 0) {
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
          this.filterElement = { "view_id": undefined, "col_name": undefined, "column_id": undefined, "op_name": undefined, "operator_id": undefined, "": undefined, "value": undefined , "is_additional": undefined };;
        }

      } else {
        // alert('Please select a view(Filter cannot be used on default view)');
        this.popUpMsg = JSON.stringify('Please select a view(Filter cannot be used on default view)');
        this.openDialog();
      }
    } catch (e) {
      // alert('Please select a view(Filter cannot be used on default view)');
      this.popUpMsg = JSON.stringify('Please select a view(Filter cannot be used on default view)');
      this.openDialog();
    }
    this.AllFilterNew = false;

  }

  saveFilter() {
    console.log(this.filterArray);
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
  //  console.log(this.filterArray);return;   
    this.accountServiceService.saveFilter(this.filterArray).subscribe(data => {
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

  getVisibleFields() {

    return (this.columns) ? this.columns : [];
  }

  getVisibleAdditionalFields(){
     return (this.additinalColumn) ? this.additinalColumn : [];
  }  
  visibleExtraFileds=[];
  availableExtraFileds=[];
additinalColumn: any[];
allAdditinalColumn: Column[];
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
  removeFilter(i: number) {
    console.log(i);
    console.log(this.filterArray);
    this.filterArray.splice(i, 1);
    console.log(this.filterArray);
  }
  rep_filter_msg=""; 


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

    console.log(this.additinalColumn);
    console.log(this.columns);
     //return false; 
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
      this.accountServiceService.updateView(this.viewId, col_list).subscribe(data => {
        // alert(JSON.stringify(data));
        this.popUpMsg = JSON.stringify(data);
        this.openDialog();
        
        if(this.isLocal){
          let add_list = [];
          for (let a of this.additinalColumn) {
            add_list.push(a.id);
          }
          this.accountServiceService.updateAdditionalView(this.viewId, add_list).subscribe(data => {
            console.log(data); 
          });

        }
        this.checkCurrentView();
      });
    }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  newAccPop: boolean = false;
  openNewAccountPop() {
    this.newAccPop = !this.newAccPop;
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
          this.newAccount.billing_country = this.country_name;
          this.newAccount.billing_state = this.state_name;
          this.newAccount.billing_city = this.city;
          this.newAccount.billing_zip = this.zip_code;
          this.newAccount.billing_street = street_address;
        });
      });
    });
  }

  fetchState() {
    this.accountServiceService.getStateList(Number(JSON.parse(this.newAccount.billing_country).id)).subscribe((data: any) => {
      this.stateList = data.states;
    });
  }

  fetchCity() {
    this.accountServiceService.getCityList(Number(JSON.parse(this.newAccount.billing_state).id)).subscribe((data: any) => {
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
  renameView() {
    if ((this.sviewName != undefined) && (this.sviewName != null) && (this.sviewName.trim() != "")) {
      this.accountServiceService.rename(this.viewId, this.sviewName).subscribe((data: any) => {
        this.exampleData = [];
        this.chRef.detectChanges();
        this.exampleData.push({ "id": 0, "text": "Recently Viewed" });
        if (data.supplier_views != undefined) {
          for (let e of data.supplier_views) {
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
      this.accountServiceService.viewVisibilityUpdate(this.viewId, this.sviewVisibility).subscribe((data: any) => {
        this.popUpMsg = JSON.stringify(data);
        this.openDialog();
      });
    } else {
      this.popUpMsg = JSON.stringify({ "message": "Please select an option" });
      this.openDialog();

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
  doneAccount() {
    this.AllFilter = false;
  }

show_merge=false;
  checkPermission() {

    if (localStorage.getItem('permissionArray') != null) {
      var permissionArray = JSON.parse(localStorage.getItem('permissionArray'));
      if (permissionArray.Account) {
        //console.log(permissionArray.Account);
        let that = this;
        permissionArray.Account.forEach(permissions => {
          if (permissions.name == 'create_account') {
            that.add_btn_show = true;
          }
          //that.add_btn_show=false; 
        });
      }
    }

      if (localStorage.getItem('modulesArray') != null) {
      var modulesArray = JSON.parse(localStorage.getItem('modulesArray')); 
        modulesArray.forEach(module => {

          if(module.acc_merge==true){
           this.show_merge=true;
          } 
       });

      } 
  }

filterValChange(){ 
  console.log(this.filterElement);
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
            || col.name=='experience_id' || col.name=='destination' || col.name=='itinerary_inclusions'
              || col.name=='sales_stage_id' || col.name=='tag_id'  ||
               col.name=='destinations' ||  col.name =='opportunity_tags' || col.name =='experiences' || 
              col.name =='inclusions' || col.name =='sales_stages'){
          this.formService.load_picklist(col.name).subscribe((data: any) => {  
            this.filter_picklist=this.setPickDropdown(data,col.name); 
            console.log(this.filter_picklist);
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
  defaultPicklist=false;
  fieldFilterChange(id) {
    this.filterElement.value='';
    this.defaultPicklist=false;
    var field_id=id;
    for (let col of this.allColumn) {
      //console.log(col);
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
        if(col.alias_name=='Account Type'){
          this.filter_picklist=this.accType;
          this.picklist_select=true;
          this.defaultPicklist=true;
        }else if(col.alias_name=='Industry'){
          this.filter_picklist=this.industries;
          this.picklist_select=true;
          this.defaultPicklist=true;

        }else if(col.alias_name=='Rating'){
          
          //this.defaultPicklistArray(this.rating);
          this.filter_picklist=this.rating;
          this.picklist_select=true;
          this.defaultPicklist=true;
          
        }else if(col.alias_name=='Created By' || col.alias_name=='Last Modified By'  || col.alias_name=='Owner'){
          this.filter_picklist=this.ownerData;
          this.picklist_select=true;
          this.date_range=false;
          this.defaultPicklist=false;
        }
        // else if(col.name=='destination'){
          
        //   this.filter_picklist=this.data_destinations;
        //   console.log(this.filter_picklist);
        //   this.picklist_select=true;
        //   this.defaultPicklist=true;
          
        // }else if(col.name=='supplier_service_id'){
          
        //   this.filter_picklist=this.data_services;
        //   this.picklist_select=true;
        //   this.defaultPicklist=false; 
          
        // }
        else{
          this.picklist_select=false;
        }
      }
    }
  }


defaultPicklistArray(pickObject){
    console.log(pickObject);
    this.filter_picklist=[];
    for (var key in pickObject) {
  if (pickObject.hasOwnProperty(key)) {
    var val = pickObject[key];
    this.filter_picklist.push({'id':key,'name':val});
    console.log(val);
  }
}
    console.log(this.filter_picklist);

}
  extraFields: any[];
  fr_options: any;
  allExtraFld: any[];
  get_additional_fields() {
    this.allExtraFld=[];
  this.extraFields=[];
    this.formService.getAllfields('Supplier').subscribe((data: any) => {
     // console.log(data);
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
       // console.log(this.extraFields);
      }
     // this.additinalColumn=[];
        this.allAdditinalColumn = this.allExtraFld;
    });

  }

  delete_view(viewId) {
    var conf = confirm("Are you sure to delete this view?");

    if (conf) {
      this.formService.delete_view(viewId, 'supplier').subscribe((data: any) => {
        console.log(data);
        this.popUpMsg = JSON.stringify(data);
        this.openDialog();
        this.refreshAccountsGrid();
      });
    }
  }


  email_error_msg = '';
  validateEmail(emailField) {
    this.email_error_msg = '';
    emailField = emailField.target;
    console.log(emailField.value.length);
    //if(emailField.value){
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
  // }else{
  //     this.email_error_msg = '';
  //     this.email_error = false;

  // }


    return true;
  }

  validate_phone(evnt) {
    //console.log(evnt.target.value);
    evnt.target.value = evnt.target.value.replace(/[^0-9-]/g, '');
    evnt.target.value = evnt.target.value.replace(/(\..*)\./g, '$1');
    return evnt.target.value;
  }

  closeRightpanel() {
    $('body').removeClass('right-bar-enabled');
  }
   close_detail_pp(){
          $("#modal_aside_left").removeClass('show');
          $("#modal_aside_left").css('display','none');
       
        $('body').removeClass('modal-open');
$('body').css('padding-right',0);
        $('.modal-backdrop').remove();
  }

clientData:any; 
    get_details(id:any){

         
      this.accountServiceService.getClientDetails(id).subscribe((data: any) => {
           this.clientData = data.account;
            $("#modal_aside_left").addClass('show');
          $("#modal_aside_left").css('display','block');
    });
    }
get_label_name(id){
  if(this.extraFields){
  for(let fld of this.extraFields){
    if(fld.id==id){
      return fld.label;
    }
  }
}
}
pinned_view_id:any;
pinned_view(){
  this.pinned_view_id=this.viewId;
   this.accountServiceService.pinned_view(this.viewId).subscribe((data) => {
    console.log(data);
      this.popUpMsg = JSON.stringify(data);
      this.openDialog(); 
      
    });
}
unpinned_view(){
  this.pinned_view_id=0;
   this.accountServiceService.unpinned_view(this.viewId).subscribe((data) => {
    console.log(data);
      this.popUpMsg = JSON.stringify(data);
      this.openDialog(); 
      
    });
}



  isStandard=false;
  standardFields=[];
  newStAccPop=false;
  formTitle="Add New Account(standard)";
  st_formType="Account";
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
                this.newAccount.billing_country = this.country_name;
                this.newAccount.billing_state = this.state_name;
                this.newAccount.billing_city = this.city;
                this.newAccount.billing_zip = this.zip_code;
                this.newAccount.billing_street = street_address;
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
        this.picklistValues.push({'type_value':[{'id':1,"name":"nammmm"}]});
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
       if(picklist_selected=='destination'){
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

autoCountryList=[];
countries_nameSearch="";
selectedCountryinationArray=[];
search_country() {
    this.autoCountryList = [];
    var val = this.countries_nameSearch; 
    if(val && val.length>2){
        this.opportunitieservice.SearchCountry(val).subscribe((data: any) => {
          console.log(data);
          if (data && data.countries) {
            this.autoCountryList = data.countries;
          } else {
            this.autoCountryList = [];
          }
        });
    }else{
        this.autoCountryList = [];
    }

  }

  selectCountId(dest_id){
     var d_avail=false;
    for(let des of this.autoCountryList){
      console.log(des);
      if(des.id==dest_id){        
          if(this.selectedCountryinationArray.length>0){
            console.log('1');

              for(let avail of this.selectedCountryinationArray){
                if(avail.id==dest_id){ 
                  d_avail=true;
                }
                  
              }
           if(d_avail==false){

             this.selectedCountryinationArray.push(des);
           }
          }else{
            console.log('0');
             this.selectedCountryinationArray.push(des);
          }
      }
    }
   this.autoCountryList=[];
   this.countries_nameSearch="";
   console.log(this.selectedCountryinationArray); 
   this.newAccount.countries=this.selectedCountryinationArray;
   this.dest_error=false;
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
   this.newAccount.destinations=this.selectedDestinationArray;
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
      this.newAccount.destinations=this.selectedDestinationArray;
  }
 removeCount(dest_id){
    var i=-1;
    var index=i;

      for(let avail of this.selectedCountryinationArray){
        i++;  
        if(avail.id==dest_id){ 
          index=i;
        } 
      }
      if(index>-1){
           this.selectedCountryinationArray.splice(index, 1);

      }
      this.newAccount.countries=this.selectedCountryinationArray;
  }

autoStateList=[];
states_nameSearch="";
selectedStateArray=[];
search_state() {
    this.autoStateList = [];
    var val = this.states_nameSearch; 
    if(val && val.length>2){
        this.opportunitieservice.SearchState(val).subscribe((data: any) => {
          console.log(data);
          if (data && data.states) {
            this.autoStateList = data.states;
          } else {
            this.autoStateList = [];
          }
        });
    }else{
        this.autoStateList = [];
    }

  }

  selectStateId(dest_id){
     var d_avail=false;
    for(let des of this.autoStateList){
      console.log(des);
      if(des.id==dest_id){        
          if(this.selectedStateArray.length>0){
            console.log('1');

              for(let avail of this.selectedStateArray){
                if(avail.id==dest_id){ 
                  d_avail=true;
                }
                  
              }
           if(d_avail==false){

             this.selectedStateArray.push(des);
           }
          }else{
            console.log('0');
             this.selectedStateArray.push(des);
          }
      }
    }
   this.autoStateList=[];
   this.states_nameSearch="";
   console.log(this.selectedStateArray); 
   this.newAccount.states=this.selectedStateArray;
   this.dest_error=false;
  }
 removeState(dest_id){
    var i=-1;
    var index=i;

      for(let avail of this.selectedStateArray){
        i++;  
        if(avail.id==dest_id){ 
          index=i;
        } 
      }
      if(index>-1){
           this.selectedStateArray.splice(index, 1);

      }
      this.newAccount.states=this.selectedStateArray;
  }
}
