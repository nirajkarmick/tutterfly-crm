import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatDialog, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-supplier-picklist',
  templateUrl: './supplier-picklist.component.html',
  styleUrls: ['./supplier-picklist.component.css']
})
export class SupplierPicklistComponent implements OnInit {

  serviceRef: Subscription;
  DATA_LinkInfo: any[];
  roles: any[];
  displayTable: boolean;
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort; 
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  newElement: string;
  pick_type="";
  pickData:any;

  constructor(private service: AdminServiceService,
    public dialog: MatDialog,private _route: ActivatedRoute) {

    this._route.queryParams.subscribe(params => {
        this.pick_type = params['type'];  
        if(this.pick_type){       
          this.fetchAllData(this.pick_type);
        }
    }); 
  }
  dtOptions: DataTables.Settings = {};
  ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 25,
            processing: true, 
          };
  }
  popUpMsg: string;
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  deleteLeadRating(id) {
    var conf = confirm('Are you sure to delete supplier '+this.pick_type+' ?');
    if (conf) {
      this.service.deleteSupplierPick(id,this.pick_type).subscribe((data: any) => {
        this.fetchAllData(this.pick_type);
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }
  leadrating: any;
  fetchAllData(pick_type) {
    this.pickData=[];
    this.serviceRef = this.service.get_supplier_picklist(pick_type).subscribe((data: any) => {
      if(this.pick_type=='ratings'){
          this.pickData = data.rating;  
      }
      if(this.pick_type=='types'){
          this.pickData = data.supplier_types;  
      }
      if(this.pick_type=='services'){
          this.pickData = data.supplier_services;  
      }
      this.displayTable = true;
    });
  }
    sortData(type,cnt){
        console.log(type+cnt);
        console.log(this.pickData); 
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
      var f = this.pickData.splice(from, 1)[0]; 
      this.pickData.splice(to, 0, f);
      console.log(this.pickData);
      for(let fld of this.pickData){        
        this.sortedFields.push(fld.id);
      }
      console.log(this.sortedFields);

      var p_data={"sort_f":this.sortedFields};
      this.service.sort_supplier_fields(p_data,this.pick_type).subscribe((data: any) => {
          console.log(data); 
      });   

  }
  modalAdd: boolean = false;
  AddNewShow(element) {
    if (element) {
      this.newElement = element.name;
      this.idUpdate = element.id;
      this.buttonLable = 'Edit';
    } else {
      this.newElement = "";
      this.buttonLable = 'Add';
    }
    this.modalAdd = true;
  }
  AddNewHide() {
    this.modalAdd = false;
  }

  modalEdit: boolean = false;
  modalEditShow() {
    this.modalEdit = true;
  }
  modalEditHide() {
    this.modalEdit = false;
  }


  create() {
    if (this.buttonLable == 'Add') {
      this.service.saveSupplierPick(this.newElement,this.pick_type).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData(this.pick_type); 
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    } else {
      this.service.updateSupplierPick(this.idUpdate, this.newElement,this.pick_type).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData(this.pick_type); 
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }
  buttonLable = 'Add';
  idUpdate: number;
  ngOnDestroy() {
    this.serviceRef.unsubscribe();
  }
}