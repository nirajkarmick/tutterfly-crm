import { Component, OnInit, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../service/report.service';
import { FormControl } from '@angular/forms';
import { MessageService } from '../message.service';
import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { OppurtunityService } from '../service/opportunity.service';
import { AccountsMapService } from '../service/accounts-map.service';
import { SupplierService } from '../service/supplier.service';
import { FormService } from '../service/form.service';

@Component({ 
  selector: 'app-add-edit-report',
  templateUrl: './add-edit-report.component.html',
  styleUrls: ['./add-edit-report.component.css']
})
export class AddEditReportComponent implements OnInit {
  metaData:any={};
  selectedTab:string;
  operatortList=[];
  filterElement = { "column_id": undefined, "operator_id": undefined,
   "value": undefined,"is_additional":undefined };
  filterArray: any[] = [];
  reportId:number;
  selectedCol=undefined;
  selectedGroup:any[]=[];
  newReportName:string;
  newReportDesc:string;
  // startDate=new FormControl(new Date().toLocaleDateString());
  // endDate=new FormControl(new Date().toLocaleDateString());
  //startDate=new FormControl(new Date());
  //endDate=new FormControl(new Date());
  startDate=new FormControl();
  endDate=new FormControl();
 // dateField:any
  dateField=1;
  leftFolderList:any[];
  rightFolderList:any[];
  selectedFolder:any={id:undefined,name:''};
  folderName:string;
  showType={id:undefined,name:undefined};
  isEdit:boolean=false;
  dateFilterNew:boolean=false;
  reportable_type_id:any;
  createData: any;
  leadData:any;
  accType:any;
  isLocalSet=true;
  showGraph=false;
  listStyle = {
            width:'100%', //width of the list defaults to 300,
            height: '100%', //height of the list defaults to 250,
            dropZoneHeight: '50px' // height of the dropzone indicator defaults to 50
            }
  constructor( private route: ActivatedRoute,private service: ReportService,public dialog: MatDialog,
    private router: Router,private acMap: AccountsMapService,private formService: FormService
    ,private msg :MessageService ,private opportunitieservice: OppurtunityService,private supplierService:SupplierService) {

       if (location.hostname.search("192.168")>=0  ||  location.hostname.search("localh")>=0 || 
        location.hostname.search("tnt1")>=0 ||  location.hostname.search("prashtest")>=0
         ||  location.hostname.search("adrenotravel")>=0){ 
          this.isLocalSet=true;       
        }  
    this.msg.sendMessage("report-main");
    this.selectedTab = this.route.snapshot.queryParams['name'];
    this.reportId = this.route.snapshot.queryParams['id'];

    if(this.reportId && this.selectedTab){
      this.getReportMetaData();
      this.getAdditionalFields();
      
      //this.createPreview();
    }else{
      this.isEdit=true;
      this.fetchReportData(this.reportId);

    } 
    this.getPicklistDataOpp();
    var start_date = new Date();
    //d.setMonth(d.getMonth()-1);
    //set create date 20 year ago from now
    //d.getFullYear(d.getFullYear()-10);
    start_date.setFullYear(start_date.getFullYear() - 20);
    var end_date = new Date();
    end_date.setDate(end_date.getDate() + 1);
    this.startDate.setValue(start_date);
    this.endDate.setValue(end_date);
 }
 sortColList:any;
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
  allAdditinalColumn: any[];
  report_type_name="";
  
getAdditionalFields(){


    if(this.selectedTab=='accounts'){
      this.report_type_name='Account';
    }else if(this.selectedTab=='contacts'){
      this.report_type_name='Contact';
    }else if(this.selectedTab=='leads'){
      this.report_type_name='Leads';
    }else if(this.selectedTab=='personal_accounts'){
      this.report_type_name='Personal Account';
    }else if(this.selectedTab=='opportunities'){
      this.report_type_name='Opportunity';
    }else if(this.selectedTab=='supplier'){
      this.report_type_name='suppliers';
      this.reportable_type_name='suppliers';
       this.supplierService.setUpAccountsMap().subscribe((sdata: any) => {
              this.supplierData = sdata;
              console.log(this.supplierData);
           });
    }
 // alert(this.report_type_name);
    if(this.report_type_name){
      this.allAdditinalColumn=[];
      this.formService.getAllfields(this.report_type_name).subscribe((data: any) => {  
        for (var i = 0; i <= data.additional_fields.length - 1; i++) { 
   
          this.allAdditinalColumn.push({ 
                            "alias_name" :data.additional_fields[i].label, 
                            "id": data.additional_fields[i].id,
                            "name": data.additional_fields[i].name, 
                            "type": data.additional_fields[i].type
                            }); 

     // console.log(this.allAdditinalColumn);
   
          } 
          
      });

    }
}
supplierData:any;
getPicklistDataOpp(){
   this.opportunitieservice.setUpAccountsMap().subscribe((data: any) => {
      this.createData = data;
   }); 


     this.service.getLeadPicklist().subscribe((data:any) => {
      this.leadData=data;
    });

     this.service.getAccPicklist().subscribe((data:any) => {
      this.acMap.setUpMaps(data);  
      this.accType = this.acMap.accTypeMapData; 
      console.log(data);
    });
} 
colSorted(evnt){   
   this.metaData.display_columns=evnt;
}
colSortedAdd(evnt){   
   this.metaData.add_display_columns=evnt;
}
 popUpMsg:string;
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
addsortColList:any;
  getReportMetaData(){
    this.service.getCreateReportMetadata(this.reportId).subscribe((data:any)=>{

      this.metaData=data;
      this.sortColList=this.metaData.display_columns; 
      this.reportable_type_id=data.reportable_type.id;
      this.add_display_columns=[];
      this.addsortColList==[];
      this.allUsers=data.users; 
      
      this.service.getOperators().subscribe((data:any)=>{
        this.operatortList=data.operators;
        this.all_operatortList=data.operators;
        console.log(this.all_operatortList);
        this.filterAllColumn(); 
      });


    });
  }
  AllFilter:boolean=false;
  AllFilterNew:boolean=false;
   filterAllColumn(){
    this.metaData.all_columns= this.metaData.all_columns.filter((col:any)=>{
      for(let dis of this.metaData.display_columns){
        if(dis.id==col.id){
          return false;
        }
      }
      return true; 
    });
   }
   filterAllColumnAdd(){
    if(this.metaData.additional_columns && this.metaData.additional_columns.length){

    this.metaData.additional_columns= this.metaData.additional_columns.filter((col:any)=>{
      for(let dis of this.add_display_columns){
        if(dis.id==col.id){
          return false;
        }
      }
      return true; 
    });
    }
   }  
   selectColumn(){
    console.log(this.selectedCol);
   let col= JSON.parse(this.selectedCol); 
    if(col.is_additional==0){
      console.log('0');
        this.metaData.display_columns.push(col);
        this.filterAllColumn(); 
    }else{      
      console.log('1');
        this.add_display_columns.push(col);
        this.filterAllColumnAdd(); 
    }
   }
   selectGroup($event:any){
     if($event.target.value){
      this.selectedGroup.push(JSON.parse($event.target.value));
     }
     this.metaData.group_bys= this.metaData.group_bys.filter((data:any)=>{
      if(JSON.parse($event.target.value).id==data.id){
        return false;
      }
      return true;
    })
    }
  ngOnInit() {
    this.showType.id= 1;
    // this.service.getOperators().subscribe((data:any)=>{
    //   this.operatortList=data.operators;
    // });
  }

  removeDisplayColumn(col:any){
    console.log(col);
    this.metaData.display_columns=this.metaData.display_columns.filter((dCol:any) =>{
      if(dCol.id==col.id){
        return false;
      }
      return true;
    });
    this.metaData.all_columns.push(col);
    this.sortColList=this.metaData.display_columns;
  }


  removeDisplayColumnAdd(col:any){
    console.log(col);
    this.add_display_columns=this.add_display_columns.filter((dCol:any) =>{
      if(dCol.id==col.id){
        console.log('av');
        return false;
      }else{
        console.log('nav');
      }
      return true;
    });
    this.metaData.additional_columns.push(col);
    this.addsortColList=this.add_display_columns;
  }
  AllFilterShowHide() {
    this.AllFilter = !this.AllFilter;
    this.AllFilterNew = false;
    this.dateFilterNew=false;
  }

  
  updateDate(event:any,type:string){
    console.log(event.value);
    console.log(type);
  }


  dateFilterNewShow(){
    this.dateFilterNew=!this.dateFilterNew;
    this.AllFilter=false;
    this.AllFilterNew = false;
  }
  closeAllfilter(){
    this.dateFilterNew=false;
    this.AllFilter=false;
    this.AllFilterNew = false;
  }
  dateFilterError=false;
  createPreview(){ 
    let dateType:any;
    if(this.endDate.value==null || this.startDate.value==null){
       $("#filter_click").trigger('click'); 
        this.popUpMsg=JSON.stringify({"message":"Please select Date Filter"});
        this.openDialog();
        this.dateFilterError=true;
        return false;
    }
    this.dateFilterError=false;
     if(this.dateField){
            var dd = (this.startDate.value.getDate() < 10 ? '0' : '') + this.startDate.value.getDate();
            var MM = ((this.startDate.value.getMonth() + 1) < 10 ? '0' : '') + (this.startDate.value.getMonth() + 1);
            var yyyy = this.startDate.value.getFullYear();
            var  startD=yyyy+'-'+MM+'-'+dd;
            var d = (this.endDate.value.getDate() < 10 ? '0' : '') + this.endDate.value.getDate();
            var M = ((this.endDate.value.getMonth() + 1) < 10 ? '0' : '') + (this.endDate.value.getMonth() + 1);
            var Y = this.endDate.value.getFullYear();
            var  endD=Y+'-'+M+'-'+d;
           
      // dateType={id: this.dateField,from_date:this.startDate.value.toLocaleDateString(),to_date:this.endDate.value.toLocaleDateString()};
      dateType={id: this.dateField,from_date:startD,to_date:endD};
    }
    console.log(dateType);
   let preview={
    name:this.newReportName,
    description:this.newReportDesc,
     reportable_type_id:this.reportable_type_id,
     //reportable_type_id:this.reportId,


     report_show_type_id:this.showType.id,
     date_field_type:dateType,
     report_filters:this.filterArray,
     column_id:this.returnIds(this.metaData.display_columns),
     group_by:this.returnIds(this.selectedGroup),
   }
   this.service.createdPreview(preview).subscribe((data:any)=>{
    if(data.applied_group_by >0){
      if(data.report_results){
         var rep_result=[];
            for (const [key, value] of Object.entries(data.report_results)) {
             // console.log(typeof(value));
                 for(let j in value){
                  //console.log(value[j]);
                     rep_result.push(value[j]);
                 }
            }
          // console.log(rep_result);
            this.metaData.report_results=rep_result;
          }
      
     }else{
          this.metaData.report_results=data.report_results;
       }

     
    
     console.log(data);

   });
  }
  openNamePopUpShow(){
  this.modalSave=true;
     setTimeout(()=>{      
          $("#modalSelectFolderP").css('display','block');
          $("#modalSelectFolderP").addClass('show');          
       },100);
  }
  openNamePopUpHide(){
     setTimeout(()=>{      
          $("#modalSelectFolderP").css('display','none');
          $("#modalSelectFolderP").removeClass('show');
          $('body').removeClass('modal-open');
$('body').css('padding-right',0);
          $('.modal-backdrop').remove();          
       },100);
  this.modalSave=false;
  }

  newFolder:boolean=false;
  AddnewFolder(){
    this.newFolder=true;
     setTimeout(()=>{      
          $("#newFolder").css('display','block');
          $("#newFolder").addClass('show');          
       },100);
  }
  HidenewFolder(){
     setTimeout(()=>{      
          $("#newFolder").css('display','none');
          $("#newFolder").removeClass('show');
          $('body').removeClass('modal-open');
$('body').css('padding-right',0);
          $('.modal-backdrop').remove();          
       },100);
    this.newFolder=false;
  }

  modalSelectFolderPop:boolean=false;
  modalSelectFolderPopShow(){
    this.modalSelectFolderPop=true;
     setTimeout(()=>{      
          $("#modalSelectFolderP").css('display','block');
          $("#modalSelectFolderP").addClass('show');          
       },100);
    this.service.getFolderList().subscribe((data:any)=>{  
      this.leftFolderList=data.all_folders;       
    });
  }
  modalSelectFolderPophide(){
   setTimeout(()=>{   
    $("#modalSelectFolderP").css('display','none');
    $("#modalSelectFolderP").removeClass('show');
    $('body').removeClass('modal-open');
$('body').css('padding-right',0);
    $('.modal-backdrop').remove();
      },100);
    this.modalSelectFolderPop=false;
  }

  modalSave:boolean=false;
  saveReport(){
    let dateType:any;
    if(this.endDate.value==null || this.startDate.value==null){
        this.popUpMsg=JSON.stringify({"message":"Please select Date Filter"});
        $("#filter_click").trigger('click'); 
        this.openDialog();
        return false;
    }
    if(this.dateField){
        var dd = (this.startDate.value.getDate() < 10 ? '0' : '') + this.startDate.value.getDate();
            var MM = ((this.startDate.value.getMonth() + 1) < 10 ? '0' : '') + (this.startDate.value.getMonth() + 1);
            var yyyy = this.startDate.value.getFullYear();
            var  startD=yyyy+'-'+MM+'-'+dd;


            var d = (this.endDate.value.getDate() < 10 ? '0' : '') + this.endDate.value.getDate();
            var M = ((this.endDate.value.getMonth() + 1) < 10 ? '0' : '') + (this.endDate.value.getMonth() + 1);
            var Y = this.endDate.value.getFullYear();
            var  endD=Y+'-'+M+'-'+d;
           
      // dateType={id: this.dateField,from_date:this.startDate.value.toLocaleDateString(),to_date:this.endDate.value.toLocaleDateString()};
      dateType={id: this.dateField,from_date:startD,to_date:endD};
    }else{
      this.popUpMsg=JSON.stringify({"message":"Please select Date Filter"});
        $("#filter_click").trigger('click'); 
    this.openDialog();
    }
   let preview={
    name:this.newReportName,
    description:this.newReportDesc,
     //reportable_type_id:this.reportId,
     reportable_type_id:this.reportable_type_id,
     report_show_type_id:this.showType.id,
     date_field_type:dateType,
     report_filters:this.filterArray,
     column_id:this.returnIds(this.metaData.display_columns),
     add_column_id:this.returnAddColumnIds(this.add_display_columns),
     group_by:this.returnIds(this.selectedGroup),
     folder_id:this.selectedFolder.id
   }
   //console.log(preview); return false;
   this.service.save(preview).subscribe(data=>{ 
    if(this.selectedTab=='suppliers'){
      this.selectedTab='supplier';
    } 
    this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['reports'] }}],{queryParams:{ 'type':this.selectedTab}});
    
   });
  }
  updateReport(){
    let dateType:any;
    if(this.endDate.value==null || this.startDate.value==null){
        this.popUpMsg=JSON.stringify({"message":"Please select Date Filter"});
        $("#filter_click").trigger('click'); 
        this.openDialog();
        return false;
    }
    if(this.dateField){
       var dd = (this.startDate.value.getDate() < 10 ? '0' : '') + this.startDate.value.getDate();
            var MM = ((this.startDate.value.getMonth() + 1) < 10 ? '0' : '') + (this.startDate.value.getMonth() + 1);
            var yyyy = this.startDate.value.getFullYear();
            var  startD=yyyy+'-'+MM+'-'+dd;

            var d = (this.endDate.value.getDate() < 10 ? '0' : '') + this.endDate.value.getDate();
            var M = ((this.endDate.value.getMonth() + 1) < 10 ? '0' : '') + (this.endDate.value.getMonth() + 1);
            var Y = this.endDate.value.getFullYear();
            var  endD=Y+'-'+M+'-'+d;
           
      // dateType={id: this.dateField,from_date:this.startDate.value.toLocaleDateString(),to_date:this.endDate.value.toLocaleDateString()};
      dateType={id: this.dateField,from_date:startD,to_date:endD};
    }else{
      this.popUpMsg=JSON.stringify({"message":"Please select Date Filter"});
        $("#filter_click").trigger('click'); 
    this.openDialog();
    }
   let preview={
    name:this.newReportName,
    description:this.newReportDesc,
     //reportable_type_id:this.reportId,
     reportable_type_id:this.reportable_type_id,
     report_show_type_id:this.showType.id,
     date_field_type:dateType,
     report_filters:this.filterArray,
     column_id:this.returnColumnIds(this.metaData.display_columns),
     add_column_id:this.returnAddColumnIds(this.add_display_columns),
     group_by:this.returnIds(this.selectedGroup),
     folder_id:this.selectedFolder.id
   }
   //console.log(preview); return false;
   this.service.updateReport(this.reportId,preview).subscribe(data=>{ 
    if(this.selectedTab=='suppliers'){
      this.selectedTab='supplier';
    } 
    this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['reports'] }}],{queryParams:{ 'type':this.selectedTab}});
    
   });
  }

    removeGroup(grp:any){ 
      this.selectedGroup=this.selectedGroup.filter((data:any)=>{
        if(grp.id==data.id){
          return false;
        }
        return true;
      });
      this.metaData.group_bys.push(grp);
      console.log(this.selectedGroup);
      console.log(this.metaData);return;
    }
  returnIds(arr:any[]){
      return arr.map((data:any)=>{ return data.id});
  }

returnColumnIds(arr:any[]){      
    var cc_Column=[];
       for(let cc of arr){
        console.log(cc.is_additional);
        if(cc.is_additional==0){
          cc_Column.push(cc.id);
        }
      }
     return cc_Column
  }

returnAddColumnIds(arr:any[]){      
  var cc_Column=[];
     for(let cc of arr){
      console.log(cc);
      if(cc.is_additional==1){
        cc_Column.push(cc.id);
      }
    }
   return cc_Column
}
  getColumnName(id:number,type:any){


  if(type==0){
     if(this.metaData && this.metaData.all_columns){
      for(let data of this.metaData.all_columns){
        if(id==data.id){
          return data.alias_name;
        }
      };
     }

    if(this.metaData && this.metaData.display_columns){
    for(let data of this.metaData.display_columns){
      if(id==data.id){
        return data.alias_name;
      }
    }
   }
  }else{
     if(this.allAdditinalColumn){
      for(let data of this.allAdditinalColumn){
        if(id==data.id){
          return data.alias_name;
        }
      };
     }
  }
   
  }
  removeFilter(i:number){
    this.filterArray.splice(i, 1);
  }
  getOperatorName(id:number){
    for(let data of this.all_operatortList){
      if(id==data.id){
        return data.name;
      }
    };
  }
  navigateTonextFolder(id:number,isRightSection:boolean){

    if(isRightSection){
      this.leftFolderList=this.rightFolderList;
    }
   this.service.getNextFolderList(id).subscribe((data:any)=>{
    this.selectedFolder=data.folder;
    this.rightFolderList=data.sub_folders;
  });


  }
  createFolder(){
   
    this.service.createFolder( this.selectedFolder.id,this.folderName).subscribe((data:any)=>{
       this.selectedFolder.name=this.folderName;
      this.selectedFolder.id=data.folder_id;
      console.log(data);
      this.modalSelectFolderPophide();
      this.HidenewFolder();
    });
    
         
  }
    checkDateFiled(field_id){    
    var f_id=this.filterElement.column_id; 
    // var c_fields=f_id.split('-');
    // field_id=c_fields[0];
    for(let col of this.metaData.all_columns){       
     if(col.id==field_id){
        var n = col.alias_name.search("Date");
        if(n > -1){
        this.date_format=true;
        }else{ 
           this.date_format=false;
        }
      }
    }
    for(let col of this.metaData.display_columns){     
     if(col.id==field_id){
        var n = col.alias_name.search("Date");
        if(n > -1){
        this.date_format=true;
        }else{ 
           this.date_format=false;
        }
      }
    }
  }
  report_name='';
  report_description='';
  report_folder=undefined;
  allFolder=[];
  filter_set=false;
  fetchFilterData(index){
  this.rep_filter_msg="";

   
    if(this.filterArray && this.filterArray.length >0 ){
        this.NewFilterShowHide();
         console.log(this.filterArray[index].is_additional);
        if(this.filterArray[index].is_additional==1){
          this.filterElement.column_id=this.filterArray[index].column_id+'-ad';
        }else{
          this.filterElement.column_id=this.filterArray[index].column_id+'-st';        
        }
        this.fieldFilterChange();
        this.filterElement.operator_id=this.filterArray[index].operator_id;
        this.filterElement.value=this.filterArray[index].value;
        this.filter_set=true;
        this.checkDateFiled(this.filterElement.column_id);
         
    }

  }

AddFilterElement(){
  this.rep_filter_msg="";
    if(this.filterElement.column_id && this.filterElement.operator_id && this.filterElement.value){
        if(this.filterElement.value instanceof Date){
            var dd = (this.filterElement.value.getDate() < 10 ? '0' : '') + this.filterElement.value.getDate();
            var MM = ((this.filterElement.value.getMonth() + 1) < 10 ? '0' : '') + (this.filterElement.value.getMonth() + 1);
            var yyyy = this.filterElement.value.getFullYear();
            this.filterElement.value=yyyy+'-'+MM+'-'+dd; 
          } 
       var i=0;   
       var filter_available=false;
      for(let filt of this.filterArray){
            console.log(filt);
            // if(filt.column_id==this.filterElement.column_id){
            //     this.filterArray[i].operator_id=this.filterElement.operator_id;
            //     this.filterArray[i].value=this.filterElement.value;
            //     filter_available=true;
            // }

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
      }
      this.AllFilterNew = false;
    }else{
      this.rep_filter_msg="*Please fill the values";
    }
  }
  rep_filter_msg="";
  NewFilterShowHide() {

     setTimeout(()=>{      
      console.log('d');  
      // $('#filterColOp').find("option:contains('Create Date')").hide();     
       },200);
    this.rep_filter_msg="";
    this.AllFilterNew = !this.AllFilterNew;
    this.filterElement.column_id='';
    this.filterElement.operator_id='';
    this.filterElement.value='';
    //this.filter_set=true;
    this.AllFilter = false;
    this.dateFilterNew=false;
  }
  closeFilterDiv(){ 
     this.AllFilterNew = false;    
  } 
  all_report_results:[];
  all_display_column:[];
  add_display_columns=[];
  reportable_type_name='';
  groupList:string[];
  reportData:any;
  allUsers=[];
fetchReportData(id: number) {
  $('body').removeClass('modal-open');
$('body').css('padding-right',0);
  $('.modal-backdrop').remove();
    this.selectedGroup=[];
    //this.service.getReport(id).subscribe((mdata: any) => {

    this.service.showReportData(id).subscribe((mdata: any) => { 
      console.log(mdata);
      this.reportData=mdata;
      if(mdata && mdata.report_filters){
        this.filterArray=mdata.report_filters;
       
      }
      if(mdata && mdata.display_columns){
        //this.all_display_column=mdata.display_columns;
      }
      this.allUsers=mdata.users; 
     console.log(mdata.add_display_columns);
      if (mdata.add_display_columns) { 
              this.add_display_columns = mdata.add_display_columns;  
              this.addsortColList=mdata.add_display_columns; 

            } else { 
              this.add_display_columns==[]; 
              this.addsortColList=[];
            }
      if(mdata && mdata.report_details){
        this.newReportName=mdata.report_details.name;
        this.newReportDesc=mdata.report_details.description;
        
        this.all_report_results=mdata.report_results;
        this.metaData.report_results=this.all_report_results;
      this.reportable_type_id=mdata.reportable_type.id;
      this.reportable_type_name=mdata.reportable_type.name;

      if(Array.isArray(mdata.report_results)){
        console.log(mdata.report_results);
        
      }else{
        var all_group_key=[];
        this.groupList=  Object.keys(mdata.report_results); 
        var total_count=0;
        for(let res in mdata.report_results){
           console.log(res);
          for(let rep of mdata.report_results[res]){            
            total_count++;
          }
        }
      }

        if(this.reportable_type_name=='suppliers'){
              this.supplierService.setUpAccountsMap().subscribe((sdata: any) => {
              this.supplierData = sdata;
              console.log(this.supplierData);
           });
        } 
        this.service.getFolderList().subscribe((data:any)=>{
            this.allFolder=data.all_folders;
          if(this.allFolder){
            for(let fol of this.allFolder){
               if(fol.id ==mdata.report_details.folder_id){                
                  this.selectedFolder.name=fol.name; 
                  this.selectedFolder.id=fol.id;  
               }    
            }
          }
         });        
        
        this.report_folder=mdata.report_details.folder_id;

        
      }
      this.service.getCreateReportMetadata(mdata.reportable_type.id).subscribe((data: any) => {
        this.metaData = data;console.log(data); 
        this.metaData.report_results=this.all_report_results;
        this.metaData.all_columns=data.all_columns;
        this.service.getOperators().subscribe((data: any) => {
          this.operatortList = data.operators;
          this.all_operatortList = data.operators;

          this.filterAllColumn(); 
        });
            if (mdata.display_columns) {
              this.metaData.display_columns = mdata.display_columns;  
              this.sortColList=mdata.display_columns; 

            } else {
              this.metaData.display_columns == []; 
              this.sortColList=[]; 
            }

      }); 

      console.log(this.sortColList);
      this.selectedTab = mdata.reportable_type.name;
      if(this.selectedTab){
        this.getAdditionalFields();
      }
      if(mdata.group_by)
      for(let groupBy of mdata.group_by)
      this.selectedGroup.push(groupBy); ;

      if(mdata.date_field_type){
        this.dateField=mdata.date_field_type.id;
        this.startDate.setValue(new Date(mdata.date_field_type.from_date));
        this.endDate.setValue(new Date(mdata.date_field_type.to_date));
      }
      this.showType.id=mdata.report_show_type.id;
      //this.newReportName=mdata.report.name;
      //this.newReportDesc=mdata.report.name;

      //this.selectedFolder=mdata.report.folder;

      // report_show_type 

      // this.filterArray = mdata.report_filters;
      // this.metaData.report_results = mdata.report_results;
    });
  }
  selectViewType(id:number){
    this.showType.id=id;
  }
  getDateType(id :number){
    // setTimeout(()=>{
      if(this.metaData.date_field_types){
         for(let d of this.metaData.date_field_types){
            if(d.id==id){
              return d.name;
            }
          }
      }
          
      //   },500);
    
  }

  date_field_types_selected=1; 
   date_format=false; 
  filter_picklist=[];
  picklist_select=false;
  fieldFilterChange(){
    this.picklist_select=false; 
    this.filterElement.value=''; 
    console.log(this.filterElement.column_id);
    var field_id=this.filterElement.column_id; 
    var c_fields=this.filterElement.column_id.split('-'); 
    field_id=c_fields[0];

    if(c_fields && c_fields.length>1 && c_fields[1]=='ad'){
       this.filterElement.column_id=field_id+'-ad';
    console.log(this.allAdditinalColumn);
    for(let col of this.allAdditinalColumn){     
       //this.picklist_select=false;
     if(col.id==field_id){ 
        if(col.type=='calender'){
        this.date_format=true;
        }else{
          console.log('no date');
           this.date_format=false;
        }

      this.setAdditionalPicklist(col);
      }
    }
    }else{
       this.filterElement.column_id=field_id+'-st';
        console.log(this.filterElement.column_id);
        for(let col of this.metaData.all_columns){     
         if(col.id==field_id){
            var n = col.alias_name.search("Date");
            if(n > -1){
            this.date_format=true;
            }else{
              console.log('no date');
               this.date_format=false;
            }
          this.checkForPickList(col);
          } 
        }
        for(let col of this.metaData.display_columns){     
         if(col.id==field_id){
            var n = col.alias_name.search("Date");
            if(n > -1){
            this.date_format=true;
            }else{
              console.log('no date');
               this.date_format=false;
            }
          this.checkForPickList(col);
          }
        }
    }
  }

  setAdditionalPicklist(col){
console.log(col.name)
 this.picklist_select=false;
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
 
       if(picklist_selected=='ratings' && this.reportable_type_name=='suppliers'){
        picklistAllValue=this.supplierData.ratings;
       } 
       if(picklist_selected=='supplier_service_id' && this.reportable_type_name=='suppliers'){
        picklistAllValue=this.supplierData.supplier_services;
       } 
       if(picklist_selected=='supplier_type_id' && this.reportable_type_name=='suppliers'){
        picklistAllValue=this.supplierData.supplier_types;
       } 

     return picklistAllValue;

  }
  all_operatortList=[];
  checkForPickList(col){
  console.log(col.alias_name);
    var all_operators=this.all_operatortList;
   this.operatortList=all_operators;
  console.log(all_operators);

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
        }else if(col.alias_name=='Industry'){
          this.filter_picklist=this.leadData.industries;
          this.picklist_select=true;
        }else if(col.alias_name=='Rating' && this.reportable_type_name!='suppliers'){
          this.filter_picklist=this.leadData.ratings;
          this.picklist_select=true;

        }
        else if(col.name=='acc_type_id'){
          //console.log(this.getKeys(this.accType));
          this.filter_picklist=this.getKeys(this.accType);
           this.picklist_select=true;
        }
        else if(col.name=='opportunitable_type'){
          //console.log(this.getKeys(this.accType));
          this.filter_picklist=this.getOpportunitableType();
           this.picklist_select=true;
        }
        else if(col.alias_name=='Lead Status'){
          this.filter_picklist=this.leadData.lead_statuses;
          this.picklist_select=true;

        } 
        else if(col.alias_name=='Created By' || col.alias_name=='Last Modified By'  || col.alias_name=='Owner'){
          this.filter_picklist=this.allUsers;
          this.picklist_select=true;

        }
        else if(col.alias_name=='Rating' && this.reportable_type_name=='suppliers'){
          this.filter_picklist=[];
          if(this.supplierData && this.supplierData.ratings){
            let k=0;
           this.filter_picklist=this.getKeys(this.supplierData.ratings);


            // for(let rat of this.supplierData.ratings){
            //  this.filter_picklist.push({'id':k,'name':rat});
            //   k++;
            // }
          }
        //this.filter_picklist=this.supplierData.ratings;
        console.log(this.filter_picklist,'ratttttt');
          this.picklist_select=true;
       } 
      else  if(col.alias_name=='Services' && this.reportable_type_name=='suppliers'){
        this.filter_picklist=this.supplierData.supplier_services;
          this.picklist_select=true;
       } 
      else  if(col.alias_name=='Supplier Type' && this.reportable_type_name=='suppliers'){
        this.filter_picklist=this.supplierData.supplier_types;
          this.picklist_select=true;
       } 

        else{
          this.picklist_select=false; 
        } 

        if(this.picklist_select==true){
  console.log('rem oper');
          this.reomve_operatorList();
        }else{ 
          this.operatortList=all_operators;
            $('#operator_list_select').find("option:contains('less than')").show(); 
            $('#operator_list_select').find("option:contains('greater then')").show(); 
        }
  }
   getKeys(map: any) {
    let arr: any[] = [];
    var i=1;
    for (let k in map) {
      console.log(map[k]);
      arr.push({"id":i,"name":map[k]});
      i++;
    }
    return arr;
  }  
  getOpportunitableType() {
    let arr: any[] = []; 
      arr.push({"id":'App\\Models\\Account',"name":'Account'}); 
      arr.push({"id":'App\\Models\\PersonalAccount',"name":'PersonalAccount'});
    return arr;
  }
   getKeysData(data:any){
      let a = 
      this.reportData.display_columns.map((obj:any)=>{return obj.name});

      return a;
    }
  reomve_operatorList(){
  console.log('remove oper');
    if(this.operatortList && this.operatortList.length>2){
      setTimeout(()=>{       
            $('#operator_list_select').find("option:contains('less than')").hide(); 
            $('#operator_list_select').find("option:contains('greater then')").hide(); 
          //  $('#operator_list_select').children('option[value="3"]').attr('disabled','disabled');     
                   },400);
     //  this.operatortList.splice(2,2); 

    }

  }
} 