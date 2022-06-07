import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatSortModule, MatSort, MatDialog, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-sales-stages',
  templateUrl: './sales-stages.component.html',
  styleUrls: ['./sales-stages.component.css']
})
export class SalesStagesComponent implements OnInit {
  serviceRef: Subscription;
  DATA_LinkInfo: any[];
  roles: any[];
  displayTable: boolean;
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort;
  displayedColumnsLinkInfo: string[];
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  newElement: any;
  positions: number[];
  constructor(private service: AdminServiceService, public dialog: MatDialog) {
    this.fetchAllData();
  }
  dtOptions: DataTables.Settings = {};
  ngOnInit() {
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true, 
          };
  }
  popUpMsg: string;
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  sales:any;
  fetchAllData() {
    this.serviceRef = this.service.getSaleStages().subscribe((data: any) => {
      this.DATA_LinkInfo = data.sales_stages;
      this.sales = data.sales_stages;
      this.displayedColumnsLinkInfo = ['sno', 'name', 'description', 'position', 'probability', 'action'];
      this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
      this.displayTable = true;
    });
  }
    sortData(type,cnt){
        console.log(type+cnt);
        console.log(this.sales); 
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
      var f = this.sales.splice(from, 1)[0]; 
      this.sales.splice(to, 0, f);
      console.log(this.sales);
      for(let fld of this.sales){
        
        this.sortedFields.push(fld.id);
      }
      console.log(this.sortedFields);

      var p_data={"sort_f":this.sortedFields};
      this.service.sort_sales_stages_fields(p_data).subscribe((data: any) => {
          console.log(data); 
      });   

  }
  modalAdd: boolean = false;
  AddNewShow(element: any) {
    if (element) {
      this.newElement = element;
      this.idUpdate = element.id;
      this.buttonLable = 'Save';
      this.service.editSalesStageMeta(element.id).subscribe((d: any) => {
        this.positions = d.positions;
      });
    } else {
      this.newElement = new Object;
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
 deleteStage(id) {
    var conf = confirm('Are you sure to delete Sales Stage?');
    if (conf) {
      this.service.deleteStage(id).subscribe((data: any) => {
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message); 
        this.openDialog();
      });
    }
  }

  create() {
    if (this.buttonLable == 'Add') {
      this.service.createSalesStage(this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    } else {
      this.service.updateSalesStage(this.idUpdate, this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();
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
