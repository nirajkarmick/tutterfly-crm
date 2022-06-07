import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../service/task.service';
import { MatDialog } from '@angular/material';
import { NewTaskComponent } from '../new-task/new-task.component';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  clientDetails:any;
  users:any[];
  account:any[];
  paccount:any[];
  task_id:any;
  constructor(private route: ActivatedRoute,
    private service:TaskService,
    private dialog:MatDialog,
    private msg :MessageService) {
    this.msg.sendMessage("task");
    let a = this.route.snapshot.queryParams['id'];
   // this.task_id=this.route.snapshot.queryParams['id'];
    this.clientDetails=JSON.parse(a);
    console.log(this.clientDetails);
    if(this.clientDetails && this.clientDetails.id){
        this.task_id=this.clientDetails.id;
        console.log(this.task_id,'task_iddddd');
    }else{
      return;
    }
    this.service.setUpAccountsMap().subscribe((data:any)=>{
      this.users=data.users;
      this.account=data.accounts;
      this.paccount=data.personal_accounts;
    });

   } 

  ngOnInit() {    
    this.service.getTaskDetails(this.task_id).subscribe((data:any)=>{
          console.log(data);
          this.clientDetails=data.task;
    });
  }
  getUserName(id:number){
    if(this.users!=undefined)
    for(let a of this.users){
      if(a.id==id){
        return a.name;
      }
    }
  }
  getOwnerName(id:number){
    if(this.paccount!=undefined)
    for(let a of this.paccount){
      if(a.id==id){
        return a.name;
      }
    }
    if(this.account!=undefined)
    for(let a of this.account){
      if(a.id==id){
        return a.name;
      }
    }
  }
  openDialog(data:any): void {
    let dialogRef = this.dialog.open(NewTaskComponent, {
      
      width: '600px',
      data: JSON.stringify(data)
    });
   
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log(result);
      if(result!=undefined && result.error!=true){
        console.log(result);
        this.ngOnInit();
        // this.updateEvent.emit(true);
      }else{
        console.log('err');
        //put Error here
      }
     });
  }
  updateGrid(){
    //alert('gf');
  }
  openFollowPop(){
    this.openDialog({task:this.clientDetails,type:"follow"});
  }
  openEditPop(){
    console.log(this.clientDetails);
    this.openDialog(this.clientDetails);
  }
}
