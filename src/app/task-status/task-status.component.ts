import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatDialog, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.css']
})
export class TaskStatusComponent implements OnInit {


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
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  deleteStat(id) {
    var conf = confirm('Are you sure to delete task status ?');
    if (conf) {
      this.service.deleteTaskStatus(id).subscribe((data: any) => {
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }
  taskstatus: any;
  fetchAllData() {
    this.serviceRef = this.service.getTaskStatus().subscribe((data: any) => {
      this.DATA_LinkInfo = data.task_statuses;
      this.taskstatus = data.task_statuses;
      this.displayedColumnsLinkInfo = ['sno', 'name', 'created_at', 'action'];
      this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
      this.displayTable = true;
    });
  }
    sortData(type,cnt){
        console.log(type+cnt);
        console.log(this.taskstatus); 
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
      var f = this.taskstatus.splice(from, 1)[0]; 
      this.taskstatus.splice(to, 0, f);
      console.log(this.taskstatus);
      for(let fld of this.taskstatus){
        
        this.sortedFields.push(fld.id);
      }
      console.log(this.sortedFields);

      var p_data={"sort_f":this.sortedFields};
      this.service.sort_task_statuses_fields(p_data).subscribe((data: any) => {
          console.log(data); 
      });   

  }
  modalAdd: boolean = false;
  AddNewShow(element: any) {
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
      this.service.saveTasktatus(this.newElement).subscribe((data: any) => {
        console.log(data)
        this.AddNewHide();
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    } else {
      this.service.updateTasktatus(this.idUpdate, this.newElement).subscribe((data: any) => {
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