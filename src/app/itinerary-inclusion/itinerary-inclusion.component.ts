import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatDialog, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { Subscription } from 'rxjs';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-itinerary-inclusion',
  templateUrl: './itinerary-inclusion.component.html',
  styleUrls: ['./itinerary-inclusion.component.css']
})
export class ItineraryInclusionComponent implements OnInit {
  serviceRef: Subscription;
  DATA_LinkInfo: any[];
  roles: any[];
  displayTable: boolean;
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort;
  displayedColumnsLinkInfo: string[];
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  newElement: any;
  active_checked = true;
  constructor(private service: AdminServiceService,
    public dialog: MatDialog) {
    this.fetchAllData();
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
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  active() {
    if (this.newElement.status == 1) {
      this.newElement.status == 0;
      this.active_checked = false;
    } else {
      this.newElement.status == 1;
      this.active_checked = true;
    }
  }
  template_type = [];
  itinerary: any;
  fetchAllData() {
    this.serviceRef = this.service.getItinInclusion().subscribe((data: any) => {
      console.log(data);
      this.DATA_LinkInfo = data.itinerary_inclusions;
      this.itinerary = data.itinerary_inclusions;
      this.displayedColumnsLinkInfo = ['sno', 'name', 'status', 'action'];
      this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
      this.displayTable = true;
    });
  }
    sortData(type,cnt){
        console.log(type+cnt);
        console.log(this.itinerary); 
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
      var f = this.itinerary.splice(from, 1)[0]; 
      this.itinerary.splice(to, 0, f);
      console.log(this.itinerary);
      for(let fld of this.itinerary){
        
        this.sortedFields.push(fld.id);
      }
      console.log(this.sortedFields);

      var p_data={"sort_f":this.sortedFields};
      this.service.sort_industry_fields(p_data).subscribe((data: any) => {
          console.log(data); 
      });   

  }
  modalAdd: boolean = false;
  AddNewShow(element: any) {
    if (element) {
      this.newElement = element;
      this.idUpdate = element.id;
      this.buttonLable = 'Save';
      this.titleLable = 'Edit';
    } else {
      this.newElement = new Object;
      this.newElement.name = '';
      this.buttonLable = 'Add';
      this.titleLable = 'Add';
    }
    this.modalAdd = true;
  }
  deleteId: any;
  deleteItin(id: any) {
    var conf = confirm('Are you sure to delete inclusion ?');
    if (conf) {
      this.service.deleteItinInc(id).subscribe((data: any) => {
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }
  AddNewHide() {
    this.modalAdd = false;
  }
  onHtmlChange(html) {
    this.newElement.footer_content_html = html;
    console.log(this.newElement.footer_content_html);
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
      console.log(this.newElement);
      this.service.saveItinInclusion(this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    } else {
      this.service.updateItinInclusion(this.idUpdate, this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }
  
  buttonLable = 'Add';
  titleLable = 'Add';
  idUpdate: number;
  ngOnDestroy() {
    this.serviceRef.unsubscribe();
  }
}
