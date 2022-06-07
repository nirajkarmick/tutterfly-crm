import { Component, OnInit, ViewEncapsulation, Input, ViewChild  } from '@angular/core';
import { Observable ,  Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatDialog,MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-oppo-destination',
  templateUrl: './oppo-destination.component.html',
  styleUrls: ['./oppo-destination.component.css']
})
export class OppoDestinationComponent implements OnInit {
  serviceRef: Subscription;
  countries:any[];
  states:any[]; 
  cities:any[];
  DATA_LinkInfo: any[];
  roles: any[];
  displayTable: boolean;
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort;
  displayedColumnsLinkInfo: string[];
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  newElement: any={ 
                  "country_id": undefined,
                  "destinations":[]
                };
  newElementEdit: any={};
  modalEdit=false;
  editable_id:any;
  public countryOptions: Select2Options;
  select_country:any;


  countryData:any=[];
  destinationData:any=[];
  public destinationOptions:any;
  public destinationOptionsEdit:any;
  selOption:Select2Options; 
  city_id:any;
  

  constructor(private service: AdminServiceService,
        public dialog: MatDialog) {
        this.fetchAllData();
  }
  dtOptions: DataTables.Settings = {}; 
  dtTrigger: Subject<any> = new Subject<any>();

   rerender(): void { 
       this.dtTrigger.unsubscribe();
       this.dtTrigger.next(); 
  }
  ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            processing: true, 
          };
    //  this.countryOptions = {
    //   multiple: true
    // }
this.destinationOptions = {
            //width: '100%',
            multiple: true,
            tags: false
        };
this.destinationOptionsEdit = {
    //width: '100%',
    multiple: false,
    tags: false
};
  }
      popUpMsg:string;
   openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {
    
    });
  }
  deleteDestin(id){ 
    var conf=confirm('Are you sure to delete destination ?');
    if(conf){
      this.service.deleteDestin(id).subscribe((data:any)=>{
        this.fetchAllData();
      this.rerender();
      this.popUpMsg=JSON.stringify(data.message);     
      this.openDialog();
      });
    }
  }
   selectBox(){    
    $('.select2-container').css('z-index',5000);

    $('#modalAdd .select2-search--inline input').css('border','none');
  }
  select_country_edit:any;
  city_id_edit:any;
  EditShow(id){
    this.modalEdit=true;
    this.editable_id=id;
    this.service.getDestination(id).subscribe((data:any) => {
      console.log(data);
      this.newElementEdit.country_id=data.destination.country_id;
      this.select_country_edit=data.destination.country_id;
      this.getDestListEdit(data.destination.country_id,data.destination.city_id); 
      this.newElementEdit.state_id=data.destination.state_id;
      this.newElementEdit.city_id=data.destination.city_id;
      //this.city_id_edit=data.destination.city_id;
      //this.getStateList(this.newElement.country_id);
      //this.getCityList(this.newElement.state_id);
    });
  }
  update(){
    this.service.updateOpDestinations(this.newElementEdit,this.editable_id).subscribe((data:any) => {
      this.newElementEdit={};
      this.city_id_edit=0;
      this.select_country_edit=0;
      this.popUpMsg=JSON.stringify(data.message);     
      this.openDialog();
      this.AddNewHide();
      this.fetchAllData();
      this.rerender();
    });
this.modalEdit=false;
  }
  destinations:any;
  destinationsCopy:any;
  fetchAllData() {

    this.destinationOptions = {
            multiple: true,
            tags: false
        };
    this.serviceRef = this.service.getOpDestinations().subscribe((data: any) => {
      this.DATA_LinkInfo = data.destinations;
      this.destinations = data.destinations;
      this.destinationsCopy = data.destinations;
      this.displayedColumnsLinkInfo =['sno','name','country','action'];
      this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
      this.displayTable = true;
    });
    this.service.createOpDestinations().subscribe((data: any) => {
     this.countries=data.countries;
         if (data.countries != undefined) { 
          this.countryData=[]; 
          //this.select_country='';         
          let i=0;
          this.countryData.push({ 
              "id": '',
              "text": 'select country' }); 
          for (let e of data.countries) {

            this.countryData.push({ 
              "id": e.iso_3,
              "text": e.country_name }); 
            //this.destinationData.push({ "id": e.id, "text": e.country_name }); 
            i++;
          }
        } 
        //console.log(this.countryData);
    });
  }
    sortData(type,cnt){
        console.log(type+cnt);
        console.log(this.destinations); 
        if(type=='u'){
          this.moveItem(cnt,cnt-1);
        }
        if(type=='d'){
          this.moveItem(cnt,cnt+1);
        }
  }
  sortedFields=[];
  moveItem(from, to) { 
    this.sortedFields=[];
      var f = this.destinations.splice(from, 1)[0]; 
      this.destinations.splice(to, 0, f);
      console.log(this.destinations);
      for(let fld of this.destinations){
        
        this.sortedFields.push(fld.id);
      }
      console.log(this.sortedFields);

      var p_data={"sort_f":this.sortedFields};
      this.service.sort_industry_fields(p_data).subscribe((data: any) => {
          console.log(data); 
      });   

  }
renderNewView(value){
  this.newElement.country_id=value;
}
  modalAdd: boolean = false;
  AddNewShow() {
    this.newElement={};
    this.select_country='';
    this.city_id=0;
    this.modalAdd = true;
  }
  AddNewHide() {
    this.modalAdd = false;
  }

  modalEditShow() {
    this.modalEdit = true;
  }
  modalEditHide() {
    this.modalEdit = false;
  }

  create(type) {
    //console.log(this.newElement);
    //return false;
    this.service.saveOpDestinations(this.newElement).subscribe((data:any) => {
     // this.newElement={};
      this.newElement={ "country_id": undefined,"destinations":[]};
      this.destinationData=[];
      this.select_country=0;
      this.city_id=0;
      this.popUpMsg=JSON.stringify(data.message);     
      this.openDialog();
      this.destinationOptions = {
            //width: '100%',
            multiple: true,
            tags: false
        };
      if(type=='add'){
         this.AddNewHide();
         this.fetchAllData(); 
         this.rerender();
      }else{
       
        this.getAllCountry();
        this.fetchAllData(); 
        this.rerender();
        //console.log(this.countryData);
      }     
    });
  }
getAllCountry(){
          this.countryData=[]; 
          this.select_country=''; 
  this.service.createOpDestinations().subscribe((data: any) => {
    // this.countries=data.countries;
         if (data.countries != undefined) {          
          let i=0;
          this.countryData.push({ 
              "id": '',
              "text": 'Select Country' }); 
          for (let e of data.countries) {

            this.countryData.push({ 
              "id": e.iso_3,
              "text": e.country_name }); 
            //this.destinationData.push({ "id": e.id, "text": e.country_name }); 
            i++;
          }
        } 
        //console.log(this.countryData);
    });
}
  ngOnDestroy() {
    this.serviceRef.unsubscribe();
  }

  getStateList(id:number){
    this.service.getStates(id).subscribe((data: any) => {
     this.states=data.states;
     this.cities=[];
     //this.getCityList(this.newElement.state_id);
     if(this.states.length > 0){
          this.getCityList(this.states[0].id);
     }
    });
  }
  getCityList(id:number){
    this.service.getCity(id).subscribe((data: any) => {
      this.cities=data.cities;
     });
  }
  destinationArray=[];

  setDestination_add(val){
  this.destinationArray=val;
  console.log(this.destinationArray);
    if(this.destinationArray.length>0){
   this.newElement.destinations=[];  
   var i=0;    
     for (let e of this.destinationData) {  
        
         for (let dest of this.destinationArray) {           
            if(e.id==dest){        
              this.newElement.destinations.push({'city_id':e.id,'state_id':e.region_code,'name':e.destin_name});  
              //this.newElement.destinations[i]=e; 
              console.log(i); 
              i++; 
            }
          }

        }
        console.log(this.newElement.destinations);
    }else{
      this.newElement.destinations=[];
    }
  }
  setDestination(val){
    if(val){
     for (let e of this.destinationData) {            
            if(e.id==val){             
              this.newElementEdit.city_id=e.id;
              this.newElementEdit.state_id=e.region_code; 
              this.newElementEdit.name=e.destin_name; 
            }
        }
    }
  }
  getDestList(id:any){ 
    this.service.getdestinations(id).subscribe((data: any) => {
      this.newElement.country_id=id;
      if(this.editable_id > 0){
        this.newElementEdit.country_id=id;
      }
      this.destinationData=[];
         if (data.destinations != undefined) {           
          let i=0;

          for (let e of data.destinations) {

            var region=e.region?' , '+e.region:'';
            this.destinationData.push({ 
                    "id": e.geonameid, 
                    "text": e.dest_name +region,
                    "region_code":e.region_code,
                    "destin_name":e.dest_name
                     }); 
            i++;
          }
          console.log(this.destinationData);
          //this.destinationOptions=this.selOption;
        } 
     });
  }
getDestListEdit(id:any,city_id){ 
    this.service.getdestinations(id).subscribe((data: any) => {
      this.newElementEdit.country_id=id;
      this.select_country_edit=id;
      this.destinationData=[];
         if (data.destinations != undefined) {          
          let i=0;

          for (let e of data.destinations) {
            var region=e.region?' , '+e.region:'';
            this.destinationData.push({ 
                    "id": e.geonameid, 
                    "text": e.dest_name +region,
                    "region_code":e.region_code,
                    "destin_name":e.dest_name
                     }); 
            i++;
            if(e.geonameid==city_id){
              this.city_id_edit=city_id;  
               console.log(this.city_id_edit);
            }
             
          }
          
     
        }
          
     });

     // setTimeout(()=>{
     //       this.city_id_edit=city_id; 
     //     },1500);

  }
  keyvalue="";
search(){
  let term = this.keyvalue;
    this.destinations = this.destinationsCopy.filter(function(tag) {
      console.log(tag.name.indexOf(term) >= 0);
        tag.name.indexOf(term) >= 0;
    }); 
    console.log(this.destinations);
}

}
