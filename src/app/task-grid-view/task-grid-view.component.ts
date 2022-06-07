import { Component, OnInit, Input, ViewChild, ChangeDetectorRef,EventEmitter, OnChanges, Output } from '@angular/core';
import {Task} from "./task";
import { MatTableDataSource, MatSort, MatPaginator, MatDialog,MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TaskService } from '../service/task.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-task-grid-view',
  templateUrl: './task-grid-view.component.html',
  styleUrls: ['./task-grid-view.component.css']
})
export class TaskGridViewComponent implements OnInit,OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private _taskData:Task[];
  @Input() set taskData(val:Task[]){
    this.taskSource.data=[];
    this._taskData=val;
    this.gridChange(val);
  }
  @Output() updatVieweGrid:EventEmitter<boolean>=new EventEmitter();
   get taskData(): Task[] {
    return this._taskData;
  }
  @Input() displayColumns:any[];
  @Input() users:any[];
  account:any[];
  paccount:any[];
  statusList:any[];
  public todayDate:any = new Date();
  priority:any[];
  contacts:any[];
  updateValue:any;
  keys:string[]=[ "id", "name","description", "due_date"];
  taskSource:MatTableDataSource<Task>=new MatTableDataSource();
  openEditRow:number;
  openEditCol:number;
  curr_page=2;
  totalData:any;
  totalCurrent=10;
  constructor(private service:TaskService,private chref :ChangeDetectorRef,private dialog:MatDialog) {
    this.service.setUpAccountsMap().subscribe((data:any)=>{
      this.account=data.accounts;
      this.paccount=data.personal_accounts;
      this.statusList=data.statuses;
      this.priority=data.priorities;
      this.users=data.users;        
    });
  }

  Editpop:boolean=false;

  EditPopHide() {
    this.Editpop = false;
  }
  EditPopShow(id:number,col:number,updVal){
    console.log(id,col,updVal);
    this.openEditRow=id;
    this.openEditCol=col;
    this.Editpop = true;
    if(col==3){
         this.updateValue=new Date(updVal);

    }else{
    this.updateValue=updVal;

    }
  }
change_data(tasks){
    console.log('change_data function');
    console.log(tasks);           
    this.gridChange(tasks);
    this.chref.detectChanges();
  }
  ngOnInit() {
    console.log(this.taskData)
    this.taskSource=new MatTableDataSource(this.taskData);
    if(this.taskSource.paginator==undefined){
      this.taskSource.paginator = this.paginator;
      this.taskSource.sort = this.sort;
      }
      this.chref.detectChanges();
      }
  ngOnChanges(){
    this.gridChange(this.taskData);
  }
  gridChange(val){
    
      this.taskSource=new MatTableDataSource(this.taskData);
      this.taskSource.paginator = this.paginator;
      this.taskSource.sort = this.sort;
    if(this.displayColumns!=undefined){
      this.keys=[];
      this.displayColumns.forEach(data=>{
        this.keys.push(data.name);
      });
    }
  }
  applyFilter(filterValue: string) {
    this.taskSource.filter = filterValue.trim().toLowerCase();

    if (this.taskSource.paginator) {
      this.taskSource.paginator.firstPage();
    }
  }
  getNames(id:number){
    this.users.forEach(data=>{
      // console.log(data.id);
      if(data.id==id){
        console.log(data.name);
        return data.name;
      }
    });
  }
  displayOption(obj:any){
    if(obj.name!=undefined){
      return obj.name;
    }else
    {
      return (obj.salutation+" "+obj.first_name+" "+obj.middle_name+" "+obj.last_name).split("null").join().replace(",","").replace(",","");
    }
  }
   popUpMsg: any;

    // openDialog(): void {
    //     //let dialogRef = this.dialog.open(TaskBoxComponent, {
    //       let dialogRef = this.dialog.open(AlertBoxComponent, {
    //         width: '250px',
    //         data: JSON.stringify(this.popUpMsg)
    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //       console.log(result);
    //     });
    // }
  updateColumn(obj:any){
    if(this.openEditCol==3){
      //alert(this.updateValue); 
      if(this.updateValue){
       this.updateValue=new Date(this.updateValue);
           var dd = (this.updateValue.getDate() < 10 ? '0' : '') + this.updateValue.getDate();
           var MM = ((this.updateValue.getMonth() + 1) < 10 ? '0' : '') + (this.updateValue.getMonth() + 1);
           var yyyy = this.updateValue.getFullYear();
           var hh = this.updateValue.getHours();
           var min = this.updateValue.getMinutes(); 
           this.updateValue=yyyy+'-'+MM+'-'+dd+' '+hh+':'+min; 
      }else{
            this.popUpMsg = "Please fill  date";
            this.openDialog(this.popUpMsg);
            return;

      }
         
    }
    let update={
      "task_id":obj.id,
      "column_id" : this.openEditCol,
      "column_data" :this.updateValue
  };
  
    this.service.updateSingleColumn(update).subscribe((data:any)=>{
      this.openDialog(data);
      // this.updateGrid();
      this.updatVieweGrid.emit(true);
      this.EditPopHide();
      this.updateValue=undefined;      
    });
  }
  updateGrid(){
    this.service.getAllClients().subscribe((data:any)=>{
      this.users=data.users;
      this.taskSource=new MatTableDataSource(data.tasks);
      this.displayColumns=data.display_columns;
    });
  }
  openDialog(data:any): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      
      width: '250px',
      data: JSON.stringify(data)
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
