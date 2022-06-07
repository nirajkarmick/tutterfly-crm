import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatDialog, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-lead-rating',
  templateUrl: './lead-rating.component.html',
  styleUrls: ['./lead-rating.component.css']
})
export class LeadRatingComponent implements OnInit {

  serviceRef: Subscription;
  DATA_LinkInfo: any[];
  roles: any[];
  displayTable: boolean;
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort;
  displayedColumnsLinkInfo: string[];
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  newElement: string;

  constructor(private service: AdminServiceService,
    public dialog: MatDialog) {
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
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  deleteLeadRating(id) {
    var conf = confirm('Are you sure to delete lead rating ?');
    if (conf) {
      this.service.deleteLeadRating(id).subscribe((data: any) => {
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }
  leadrating: any;
  fetchAllData() {
    this.serviceRef = this.service.getLeadRating().subscribe((data: any) => {
      this.DATA_LinkInfo = data.ratings;
      this.leadrating = data.ratings;
      this.displayedColumnsLinkInfo = ['sno', 'name', 'created_at', 'action'];
      this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
      this.displayTable = true;
    });
  }
    sortData(type,cnt){
        console.log(type+cnt);
        console.log(this.leadrating); 
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
      var f = this.leadrating.splice(from, 1)[0]; 
      this.leadrating.splice(to, 0, f);
      console.log(this.leadrating);
      for(let fld of this.leadrating){
        
        this.sortedFields.push(fld.id);
      }
      console.log(this.sortedFields);

      var p_data={"sort_f":this.sortedFields};
      this.service.sort_ratings_fields(p_data).subscribe((data: any) => {
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
      this.service.saveLeadRating(this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData(); 
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    } else {
      this.service.updateLeadRating(this.idUpdate, this.newElement).subscribe((data: any) => {
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