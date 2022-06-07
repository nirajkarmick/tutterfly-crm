import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatProgressSpinnerModule, MatDialog, MatSortModule, MatSort, MatTableModule, MatInputModule, MatAutocompleteModule, MatButtonModule } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { AdminServiceService } from '../service/admin-service.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
@Component({
  selector: 'app-task-priorities',
  templateUrl: './task-priorities.component.html',
  styleUrls: ['./task-priorities.component.css']
})
export class TaskPrioritiesComponent implements OnInit {
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

  deleteTaskPr(id) {
    var conf = confirm('Are you sure to delete task priorities?');
    if (conf) {
      this.service.deleteTaskPr(id).subscribe((data: any) => {
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    }
  }
  taskpriorities: any;
  fetchAllData() {
    this.serviceRef = this.service.getTaskPriorities().subscribe((data: any) => {
      this.DATA_LinkInfo = data.task_priorities;
      this.taskpriorities = data.task_priorities;
      this.displayedColumnsLinkInfo = ['sno', 'name', 'created_at', 'action'];
      this.dataSourceLinkInfo = new MatTableDataSource<any>(this.DATA_LinkInfo);
      this.displayTable = true;
    });
  }
    sortData(type,cnt){
        console.log(type+cnt);
        console.log(this.taskpriorities); 
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
      var f = this.taskpriorities.splice(from, 1)[0]; 
      this.taskpriorities.splice(to, 0, f);
      console.log(this.taskpriorities);
      for(let fld of this.taskpriorities){
        
        this.sortedFields.push(fld.id);
      }
      console.log(this.sortedFields);

      var p_data={"sort_f":this.sortedFields};
      this.service.sort_task_priorities_fields(p_data).subscribe((data: any) => {
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
      this.service.saveTaskPriority(this.newElement).subscribe((data: any) => {
        this.AddNewHide();
        this.fetchAllData();
        this.popUpMsg = JSON.stringify(data.message);
        this.openDialog();
      });
    } else {
      this.service.updateTaskPriority(this.idUpdate, this.newElement).subscribe((data: any) => {
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