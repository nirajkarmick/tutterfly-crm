import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatDialog, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { Subscription } from 'rxjs';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
@Component({
  selector: 'app-opp-tags',
  templateUrl: './opp-tags.component.html',
  styleUrls: ['./opp-tags.component.css']
})
export class OppTagsComponent implements OnInit {

  serviceRef: Subscription;
  DATA_LinkInfo: any[];
  roles: any[];
  displayTable: boolean;
  @ViewChild(MatPaginator) paginatorLinkInfo: MatPaginator;
  @ViewChild(MatSort) sortLinkInfo: MatSort;
  displayedColumnsLinkInfo: string[];
  dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
  newElement: string;
  newElement2: string;

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
  deleteInclu(id) {
    var conf = confirm('Are you sure to delete tag?');
    if (conf) {
      this.service.deleteOppTag(id).subscribe((data: any) => {
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }
  opp_tags: any;
  fetchAllData() {
    this.serviceRef = this.service.getOppTags().subscribe((data: any) => {
    	console.log(data);
      this.DATA_LinkInfo = data.opportunity_tags;
      this.opp_tags = data.opportunity_tags;
      this.displayedColumnsLinkInfo = ['sno', 'name', 'alias_name', 'created_at', 'action'];
      this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
      this.displayTable = true;
    });
  }
    sortData(type,cnt){
        console.log(type+cnt);
        console.log(this.opp_tags); 
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
      var f = this.opp_tags.splice(from, 1)[0]; 
      this.opp_tags.splice(to, 0, f);
      console.log(this.opp_tags);
      for(let fld of this.opp_tags){
        
        this.sortedFields.push(fld.id);
      }
      console.log(this.sortedFields);

      var p_data={"sort_f":this.sortedFields};
      this.service.sort_opp_tags_fields(p_data).subscribe((data: any) => {
          console.log(data);  
      });   

  }
  modalAdd: boolean = false;
  AddNewShow(element: any) {
    if (element) {
      this.newElement = element.name;
      this.newElement2 = element.alias_name;
      this.idUpdate = element.id;
      this.buttonLable = 'Edit';
    } else { 
      this.newElement = "";
      this.newElement2 = "";
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
      this.service.saveOppTags(this.newElement, this.newElement2).subscribe((data: any) => {
        this.AddNewHide();
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    } else {
      this.service.updateOppTags(this.idUpdate, this.newElement, this.newElement2).subscribe((data: any) => {
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