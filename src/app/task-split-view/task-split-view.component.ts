import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output,OnChanges  } from '@angular/core';
import { Task } from '../task-grid-view/task';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { NewTaskComponent } from '../new-task/new-task.component';

@Component({
  selector: 'app-task-split-view',
  templateUrl: './task-split-view.component.html',
  styleUrls: ['./task-split-view.component.css']
})
export class TaskSplitViewComponent implements OnChanges  {
  @Input() clientDetails=new Task();
  @Input() users:any[];
  taskData:Task[]=[];
  @Output() updateEvent= new EventEmitter<boolean>();
  @Input('taskData') set taskGridData(data:Task[]){
    this.taskData=data;
    console.log(this.taskData);
    this.filtertaskData=JSON.parse(JSON.stringify( this.taskData ));
    if(this.taskData && this.taskData.length>0){
        this.clientDetails.created_at=this.taskData[0].created_at;
        this.clientDetails.updated_at=this.taskData[0].updated_at;      
   }
      this.chref.detectChanges();
    }
  filtertaskData:Task[]=[];
  show_info_date:false;
  constructor(private chref:ChangeDetectorRef,private dialog:MatDialog) { 


  }
// get_sytemIfoDate(){
//    this.show_info_date=true;
//    if(this.taskData && this.taskData.length>0){
//     this.clientDetails.created_at=this.taskData[0].created_at;
//     this.clientDetails.updated_at=this.taskData[0].updated_at;
//    }
// }
  ngOnInit() {
    this.filtertaskData=JSON.parse(JSON.stringify( this.taskData ));
  }
  change_data(tasks){
    console.log('change_data split function');
    this.taskData=tasks;
    console.log(this.taskData);
    this.filtertaskData=JSON.parse(JSON.stringify( this.taskData ));
      this.chref.detectChanges();
  }
  get_taskable_type(tsk_type){
   // console.log(tsk_type);
    if(tsk_type=='App\\Account'){
     // console.log('acc');
    }
    if(tsk_type=='App\\PersonalAccount'){
     // console.log('PA');
    }
   
  }
  //this will called when data is passed from parent to child.
  ngOnChanges(){
    //  console.log("change detected");
     // console.log(this.taskData);                
  }
  getUserName(id:number){
    if(this.users!=undefined)
    for(let a of this.users){
      if(a.id==id){
        return a.name;
      }
    }
  }
  get_the_date(dt){  
   // console.log(dt,'tast created date');
    return dt;   
  }
  changeTask(task:Task){
    this.clientDetails=task;
  }
  render:boolean=true;
  filter(val:string){
    this.filtertaskData   =[];
    this.render=false;
    if(val==undefined || val=="" || val==null){
      this.filtertaskData=this.taskData;
    }else{
    this.taskData.forEach((data)=>{
      if( data.name.toLowerCase().includes(val.trim().toLowerCase())){
        this.filtertaskData.push(data);
      }
    });
  }
    this.render=true;
    this.chref.detectChanges();    
  }
  
  openEditPop(){
    //console.log(this.clientDetails);
    this.openDialog(this.clientDetails);
  }
  openDialog(data:any): void {
    let dialogRef = this.dialog.open(NewTaskComponent, {
      
      width: '600px',
      data: JSON.stringify(data)
    });
   
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result!=undefined && result.error!=true){
        this.updateEvent.emit(true);
      }else{
        //put Error here
      }
     });
  }
  openFollowPop(){
    this.openDialog({task:this.clientDetails,type:"follow"});
  }
}
