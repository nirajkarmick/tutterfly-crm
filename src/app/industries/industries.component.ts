import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatDialog, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

import { Subject } from 'rxjs';
@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.css']
})
export class IndustriesComponent implements OnInit {
  serviceRef: Subscription;
  DATA_LinkInfo: any[];
  roles: any[];
  displayTable: boolean;
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort;
  displayedColumnsLinkInfo: string[];
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  industryName: string;

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

  deleteIndustries(id) {
    var conf = confirm('Are you sure to delete industry ?');
    if (conf) {
      this.service.deleteIndustries(id).subscribe((data: any) => {
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }

  industries: any;
  fetchAllData() {
    this.serviceRef = this.service.getAllIndustries().subscribe((data: any) => {
      this.DATA_LinkInfo = data.industries;
      this.industries = data.industries;
      this.displayedColumnsLinkInfo = ['sno', 'name', 'description', 'status', 'action'];
      this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
      this.displayTable = true;
    });
  }
    sortData(type,cnt){
        console.log(type+cnt);
        console.log(this.industries); 
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
      var f = this.industries.splice(from, 1)[0]; 
      this.industries.splice(to, 0, f);
      console.log(this.industries);
      for(let fld of this.industries){
        
        this.sortedFields.push(fld.id);
      }
      console.log(this.sortedFields);

      var p_data={"sort_f":this.sortedFields};
      this.service.sort_industry_fields(p_data).subscribe((data: any) => {
          console.log(data); 
      });   

  }
  modalAdd: boolean = false;
  AddNewShow(element) { 
    if (element) {
      this.industryName = element.name;
      this.idUpdate = element.id;
      this.buttonLable = 'Edit';
    } else {
      this.industryName = "";
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


  saveIndustry() {
    if (this.buttonLable == 'Add') {
      this.service.saveIndustry(this.industryName).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      this.rerender();
      });
    } else {
      this.service.updateIndustry(this.idUpdate, this.industryName).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
        this.rerender();
      });
    }

  }

  ngOnDestroy() {
    this.serviceRef.unsubscribe();
  }
  buttonLable = 'Add';
  idUpdate: number;
}