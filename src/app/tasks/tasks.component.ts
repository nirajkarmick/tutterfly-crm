import {Component, OnInit, ChangeDetectorRef,ViewChild} from '@angular/core';
import {TaskService} from '../service/task.service';
import {Task} from '../task-grid-view/task';
import {Column} from '../accounts-grid/column';
import {MatDialog} from '@angular/material';
import {AlertBoxComponent} from '../alert-box/alert-box.component';
import {NewTaskComponent} from '../new-task/new-task.component';
import {MessageService} from '../message.service';
import { FormService } from '../service/form.service';
import { TaskGridViewComponent } from '../task-grid-view/task-grid-view.component';

import { TaskSplitViewComponent } from '../task-split-view/task-split-view.component';
@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
    viewType: boolean = true;
    tableData: Task[];
    task = new Task();
    users: any[];
    displayColumns: any[];
    exampleData: any[] = [];
    viewId: number=0; 
    public options: Select2Options;
  @ViewChild(TaskGridViewComponent) task_grid: TaskGridViewComponent;

  @ViewChild(TaskSplitViewComponent) task_split: TaskSplitViewComponent;
    filterArray: any[];
    colMap = {};
    opMap = {};
  curr_page=2;
  totalData:any;
  totalCurrent=10;
    filterElement = {
        "view_id": undefined,
        "col_name": undefined,
        "column_id": undefined,
        "op_name": undefined,
        "operator_id": undefined,
        "": undefined,
        "value": undefined
    };
    allOperators: any;
    allColumn: Column[];
    sviewVisibility: number = 0;
    sviewName: string;
    statusList: any[];
    priority: any[];

    constructor(private service: TaskService,private formService:FormService ,
        private chref: ChangeDetectorRef, public dialog: MatDialog,
         private msg: MessageService) {
        this.msg.sendMessage("task");
        this.service.getAllClients().subscribe((data: any) => {
            this.refreshViewData(data);
        this.exampleData = [];
        this.exampleData.push({"id": 0, "text": "Recently Viewed"});

            if (data.task_views != undefined) {
                for (let e of data.task_views) {
                    this.exampleData.push({"id": e.id, "text": e.name});
                }
            } else {
                for (let e of data.task_views) {
                    this.exampleData.push({"id": e.id, "text": e.name});
                }
            }
        
        });
        this.service.getAllOperators().subscribe((data: any) => {
            this.allOperators = data.operators;
            for (let a of this.allOperators) {
                this.opMap[a.id] = a.name;
            }
            this.filterElement.operator_id = this.allOperators[0].id;
        });
        this.service.getAllColumnList().subscribe((data: any) => {

            this.allColumn = data.task_all_columns;
            for (let a of this.allColumn) {
                this.colMap[a.id] = a.alias_name;
            }
            this.filterElement.column_id = this.allColumn[0].id;

            this.chref.detectChanges();
        });
         this.service.setUpAccountsMap().subscribe((data: any) => {
            this.statusList = data.statuses;
            this.priority = data.priorities;
        });

    }

    popUpMsg: string;

    openDialog(): void {
        let dialogRef = this.dialog.open(AlertBoxComponent, {
            width: '250px',
            data: this.popUpMsg
            // data: { name: "this.name", animal: "this.animal" }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }

    ngOnInit() {
    }

    tableViewShow() {
        this.viewType = true;
    }

    splitViewShow() {
        this.viewType = false;
    }

    renderNewView(viewId: any) {
       
        this.viewId = viewId;
        //this.selected_view=viewId;
        this.curr_page=1;
        if (viewId == 0) {
            this.service.getAllClients().subscribe((data: any) => {

                this.refreshViewData(data);
            });
        } else {
            this.service.fetchView(viewId,this.curr_page).subscribe((data: any) => {
                this.filterArray = data.task_filters;
                console.log(data);
                this.refreshViewData(data);
            });
        }
         this.curr_page=2;
    }
  showMoreButton=true;
loadMoreData(viewId){ 
   if(viewId>0){
    this.service.fetchView(viewId,this.curr_page).subscribe((data:any) => {
         if(data){   
           this.setPaginationData(data);    
         } 
    });

   }else{
    this.service.moreTask(this.curr_page).subscribe((data:any) => {
         if(data){   
           this.setPaginationData(data);    
         } 
    });

   } 

}
setPaginationData(data){
           var a_data=data; 
           var acc_data=a_data.tasks;
           let that=this;
           console.log(this.tableData);      
           Object.keys(acc_data).map(function(key) {
                 that.tableData.push(acc_data[key]);
            });                
           console.log(this.tableData);      
             //this.tableData[0]=333;
           this.curr_page=parseInt(a_data.pagination.current_page) + 1; 
          // this.chref.detectChanges();
          // this.refreshViewData({"tasks":this.tableData,"totalData":this.totalData}); 
          this.totalCurrent=this.tableData.length;  
            if(this.viewType){
                this.task_grid.change_data(this.tableData); 
            }else{ 
                this.task_split.change_data(this.tableData); 
            }
        

}
    refreshViewData(data: any) {
        console.log(data);
        var selected_view=this.viewId;
        this.tableData = undefined;
        this.displayColumns = data.display_columns;
        //this.exampleData = [];
        //this.exampleData.push({"id": 0, "text": "Recently Viewed"});
        // if (data.task_views != undefined) {            
        //     if (data.task_views != undefined) {
        //         for (let e of data.task_views) {
        //             this.exampleData.push({"id": e.id, "text": e.name});
        //         }
        //     } else {
        //         for (let e of data.task_views) {
        //             this.exampleData.push({"id": e.id, "text": e.name});
        //         }
        //     }
        // }
        
        this.columns = data.display_columns;

        if (data.users != undefined) {
            this.users = data.users;
        }

        this.tableData = data.tasks; 
        this.totalCurrent=10;
        this.totalData=data.total; 

        if (data.first_task != undefined) {
            this.task = data.first_task;
        } else {
            this.task = this.tableData[0];
        }
        this.chref.detectChanges();
    } 

    AllFilter: boolean = false;
    AllFilterNew: boolean = false;

    AllFilterShowHide() {
        this.AllFilter = !this.AllFilter;
        this.AllFilterNew = false;
    }

    NewFilterShowHide() {
        this.AllFilterNew = !this.AllFilterNew;
        this.AllFilter = false;
    }

    newAccPop: boolean = false;

    openNewAccountPop() {
        this.openNewTask();
    }

    updateViewName() { 
        if ((this.sviewName != undefined) && (this.sviewName != null) && (this.sviewName.trim() != "")) {
           var selected_viewid=this.viewId;
            this.service.rename(this.viewId, this.sviewName).subscribe((data: any) => {
                this.exampleData = [];
                this.exampleData.push({"id": 0, "text": "Recently Viewed"});
                if (data.task_views != undefined) {
                    for (let e of data.task_views) {
                        this.exampleData.push({"id": e.id, "text": e.name});
                    }
                }
                this.chref.detectChanges();
                this.popUpMsg = JSON.stringify(data);
                this.openDialog();
                 setTimeout(()=>{
                   // alert(this.viewId); 
                   // this.show_select2=true;
                        this.viewId=selected_viewid; 
                     },4500);
            });
        } else {
            this.popUpMsg = JSON.stringify({"message": "Please enter the name"});
            this.openDialog();
        }
    }
get_view_name(){
    for(let dt of this.exampleData){
        console.log(dt);
        if(dt.id==this.viewId){
            this.sviewName=dt.text;
        }
    }
}
    updateViewVisibility() {
        if (this.sviewVisibility != undefined && this.sviewVisibility != null) {
            this.service.viewVisibilityUpdate(this.viewId, this.sviewVisibility).subscribe((data: any) => {
                this.popUpMsg = JSON.stringify(data);
                this.openDialog();
            });
        } else {
            this.popUpMsg = JSON.stringify({"message": "Please select an option"});
            this.openDialog();

        }
    }
selected_view=0;
show_select2=false;
    createView() {
        if (this.sviewVisibility != undefined && this.sviewVisibility != null && this.sviewName != undefined) {
            this.service.createView(this.sviewName, this.sviewVisibility).subscribe((data: any) => {
                this.popUpMsg = JSON.stringify(data);
                this.openDialog(); 
                console.log(data);               
                this.exampleData.push({"id": data.task_view.id, "text": data.task_view.name});
                console.log(this.exampleData);  
                this.show_select2=true;
                this.viewId=data.task_view.id;
                this.selected_view=data.task_view.id;
                this.renderNewView(data.task_view.id);
               
                 
                setTimeout(()=>{
                        this.viewId=data.task_view.id;
                     },4500);

            });
        }
    }

    checkCurrentView() {
        if (this.viewId != undefined) {
            this.renderNewView(this.viewId);
        } else {
            this.renderNewView(0);
        }
    }

    columns: Column[];
    aFields: Column[];
    visiFields: Column[];

    getAvailableFields() {
        let col: Column[] = [];
        for (let c1 of this.allColumn) {
            let flag = true;
            for (let c of this.columns) {
                if (c.id == c1.id) {
                    flag = false;
                }
            }
            if (flag) {
                col.push(c1);
            }
        }

        return col;

    }

    getVisibleFields() {

        return this.columns;
    }

    removeFilter(i: number) {
        this.filterArray.splice(i, 1);
    }

    moveToVisisble() {


        for (let a of this.aFields) {

            this.columns.push(a);


        }
        console.log(this.columns);
        this.aFields = [];
    }

    moveToAvailable() {
        this.visiFields = JSON.parse(JSON.stringify(this.visiFields));
        for (let a of this.visiFields) {

            for (let b in this.columns) {
                if (a.id == this.columns[b].id) {
                    this.columns.splice(Number(b), 1);
                    break;
                }
            }
        }
    }

    updateColumns() {
        if (this.columns.length >= 15) {
            // alert('Selected display column should be less than 15');
            this.popUpMsg = JSON.stringify('Selected display column should be less than 15');
            this.openDialog();
        }
        else {
            let col_list = [];
            for (let a of this.columns) {
                col_list.push(a.id);
            }
            this.service.updateView(this.viewId, col_list).subscribe(data => {
                this.checkCurrentView();
                this.popUpMsg = JSON.stringify(data);
                this.openDialog();
            });
        }
    }
 moveUp() {
    if (this.visiFields) {
      let index = this.getIndexArray();
      if (index.length != 0) {
        for (let i of index) {
          if (i != 0) {
            [this.columns[i - 1], this.columns[i]] = [this.columns[i], this.columns[i - 1]];
          }
        }
      }
    }
  }
  moveDown() {
    if (this.visiFields) {
      let c = [];
      let index = this.getIndexArray();
      index.reverse();
      for (let i of index) {
        if (i < (this.columns.length - 1)) {
          let temp = this.columns[i];
          this.columns[i] = this.columns[i - 0 + 1];
          this.columns[i - 0 + 1] = temp;
        }
      }
    }
  }
   getIndexArray() {
    let index = [];
    for (let i in this.columns) {
      for (let j in this.visiFields) {
        if (this.columns[i].id == this.visiFields[j].id) {
          index.push(i);
        }
      }
    }
    return index;
  }
    updateGrid(flag: boolean) {
        this.refreshViewData(this.viewId);
    }

    saveFilter() {
        if (this.filterArray.length == 0) {
            this.filterElement.view_id = this.viewId;
            this.filterElement.column_id = "";
            this.filterElement.operator_id = "";
            this.filterElement.value = "";
            this.filterArray.push(this.filterElement);
        }
        this.service.saveFilter(this.filterArray).subscribe(data => {
            console.log("save " + JSON.stringify(data));
            this.renderNewView(this.viewId);
        });
        this.filterElement.view_id = undefined;
        this.filterArray = [];

    } 

  filter_set=false;
  rep_filter_msg="";
  fetchFilterData(index){
  this.rep_filter_msg="";
    console.log(this.filterArray[index]); 
    if(this.filterArray && this.filterArray.length >0 ){
        this.NewFilterShowHide();
        this.fieldFilterChange(this.filterArray[index].column_id);
        this.filterElement.operator_id=this.filterArray[index].operator_id;
        this.filterElement.value=this.filterArray[index].value; 
        this.filter_set=true; 
        this.checkDateFiled(this.filterArray[index].column_id,this.filterElement.value);
        this.filterElement.column_id=this.filterArray[index].column_id;         
    }

  } 
 date_value_array=['CURRENT MONTH','PREVIOUS MONTH','TODAY','YESTERDAY','TOMORROW'];
  checkDateFiled(field_id,field_value){ 
  //  alert(field_id);
    console.log(this.allColumn)
    for(let col of this.allColumn){     
     if(col.id==field_id){
        var n:any = col.alias_name.search("Date");
        if(n > -1){
        this.date_format=true;
            this.date_range=true;
        }else{ 
           this.date_format=false;
            this.date_range=false;
        }
      }
    }
    for(let col of this.displayColumns){     
     if(col.id==field_id){
        var n = col.alias_name.search("Date");
        if(n > -1){
        this.date_format=true;
        this.date_range=true;
        }else{ 
           this.date_format=false;
            this.date_range=false;
        }
      }
    }
    var dd_check=false; 
    if(this.date_format==true){
      for(let dd of this.date_value_array){
        if(dd==field_value){
          dd_check=true;
        }
      }
    }
    if(dd_check==true){
      this.date_format=false;
    }
  } 
    AddFilterElement() {
  this.rep_filter_msg="";
        try {
            if (this.viewId !== 0) {
                this.filterElement.view_id = this.viewId;
                if (this.filterElement.value != undefined && this.filterElement.column_id != undefined && this.filterElement.operator_id != undefined) {
                    if (this.filterArray == undefined) {
                        this.filterArray = [];
                    }
                  if(this.filterElement.value instanceof Date){
                    var dd = (this.filterElement.value.getDate() < 10 ? '0' : '') + this.filterElement.value.getDate();
                    var MM = ((this.filterElement.value.getMonth() + 1) < 10 ? '0' : '') + (this.filterElement.value.getMonth() + 1);
                    var yyyy = this.filterElement.value.getFullYear();
                    this.filterElement.value=yyyy+'-'+MM+'-'+dd;
                  }


             var i=0;   
             var filter_available=false;
            for(let filt of this.filterArray){
                  console.log(filt,'st fld');
                  if(filt.column_id==this.filterElement.column_id){
                      this.filterArray[i].operator_id=this.filterElement.operator_id;
                      this.filterArray[i].value=this.filterElement.value;
                      filter_available=true;
                  } 

                  i++;
            }
          if (this.filterArray == undefined) {
            this.filterArray = [];
          }
          if(filter_available==false){  
               this.filterArray.push(JSON.parse(JSON.stringify(this.filterElement)));
                  console.log(this.filterArray);
          }
                    //this.filterArray.push(this.filterElement);
                    this.AllFilterNew = false;
                    this.filterElement = {
                        "view_id": undefined,
                        "col_name": undefined,
                        "column_id": undefined,
                        "op_name": undefined,
                        "operator_id": undefined,
                        "": undefined,
                        "value": undefined
                    };

                }
            } else {
                // alert('Please select a view(Filter cannot be used on default view)');
                this.popUpMsg = JSON.stringify('Please select a view(Filter cannot be used on default view)');
                this.openDialog();
            }
        } catch (e) {
            // alert('Please select a view(Filter cannot be used on default view)');

            this.popUpMsg = JSON.stringify(e);
            this.openDialog();
        }
    this.AllFilterNew = false;

    }

    openNewTask(): void {
        let dialogRef = this.dialog.open(NewTaskComponent, {
            panelClass: 'taskNewPop',
            width: '600px',
            data: JSON.stringify({})
        });

        dialogRef.afterClosed().subscribe((result: any) => {
            if (result != undefined && result.error != true) {
                if (this.viewId == undefined) {
                    this.viewId = 0;
                }
                this.renderNewView(this.viewId);
            } else {
                //put Error here

            }
        });
    }

    recieveEvent(event: boolean) {
        if (event)
            if (this.viewId == undefined) {
                this.viewId = 0;
            }

        this.renderNewView(this.viewId);
    }

delete_view(viewId){
  var conf=confirm("Are you sure to delete this view?");

  if(conf){
     this.formService.delete_view(viewId,'task').subscribe((data:any)=>{
      console.log(data);
      if(data){
          this.popUpMsg=JSON.stringify(data);
          this.openDialog();
          this.renderNewView(0);
      }

    }); 
  }

   
}
  loadDate(type){
    if(type=='custom'){
      this.date_format=true;
       this.filterElement.value='';
    }else{
       this.date_format=false;
       this.filterElement.value=type;
    } 
  }
  filterValChange(){  
    var col_id= this.filterElement.column_id
    this.fieldFilterChange(col_id); 
  
   console.log(this.filterElement);
}
 date_range=false;
    date_format=false;
  filter_picklist=[];
  picklist_select=false;
  fieldFilterChange(val){
    var field_id=val; 
    for(let col of this.allColumn){
      if(col.id==field_id){
        console.log(col.alias_name);
        var n = col.alias_name.search("Date");
        if(n > -1){
        console.log('date'); 
        this.date_format=true;
        this.date_range=true;
        }else{
          console.log('no date');
           this.date_format=false;
           this.date_range=false;
        }
        if(col.alias_name=='Priority'){
          this.filter_picklist=this.priority;
          this.picklist_select=true;
        }else if(col.alias_name=='Status'){
          this.filter_picklist=this.statusList;
          this.picklist_select=true;

        }else{
          this.picklist_select=false;
        }
      }
    }
  }

}

