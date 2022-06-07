import {Component, OnInit, Output, EventEmitter, Input, Inject} from '@angular/core';
import {TaskService} from '../service/task.service';
import {Task} from '../task-grid-view/task';
import {FormControl} from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TaskBoxComponent} from '../task-box/task-box.component';
import {AlertBoxComponent} from '../alert-box/alert-box.component';
import { OppurtunityService } from '../service/opportunity.service';

@Component({
    selector: 'app-new-task',
    templateUrl: './new-task.component.html',
    styleUrls: ['./new-task.component.css'],
    /*host: {'class': 'modal'}*/
})
export class NewTaskComponent implements OnInit {
    @Output() updateGrid: EventEmitter<boolean> = new EventEmitter();
    @Input() newTask = new Task();
    account: any[];
    paccount: any[];
    statusList: any[];
    priority: any[];
    users: any[];
    contacts: any[];
    date = new FormControl(new Date().toLocaleDateString());
    title: string;
    editFlag: boolean = false;
    botton_tittle='Add';
    public todayDate:any = new Date();
    related_to=true;

    constructor(private service: TaskService, private opportunitieservice: OppurtunityService, private dialog: MatDialog,
                public dialogRef: MatDialogRef<NewTaskComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
        console.log(data)
        let temp = JSON.parse(data);
        //this.newTask.taskable_id=any; 
        if (data != "{}") {
            if (temp.type == "follow") {
                data = temp.task;
                this.editFlag = true;
                this.newTask = temp.task;
                this.title = "Create Follow Up Task";
               
                if (this.newTask.taskable_type == "App\\Account") {
                    console.log(temp);
                      if(temp.task.taskable_id.id ==undefined){
                        this.newTask.taskable_id=temp.task.taskable_id;
                    }else{
                        this.newTask.taskable_id=temp.task.taskable_id.id;
                    }
                    this.AccountContShow();
                     
                    console.log(this.newTask.taskable_id);
                    this.fetch_acc_det(this.newTask.taskable_id); 
                    this.getContact(this.newTask.taskable_id, false);
                    if (temp.task.contact_id != undefined)
                        this.newTask.contact_id = temp.task.contact_id.id;
                } else if (this.newTask.taskable_type == "App\\PersonalAccount"){
                    this.PerAccountContShow(); 
                    this.per_account_nameSearch=temp.task.taskable_id.name; 
                }else if (this.newTask.taskable_type == "App\\Opportunity"){
                    this.OppContShow();
                    this.opp_nameSearch=temp.task.taskable_id.name;
 
                }else{
                    this.AccountCont=false;
                    this.related_to=false;

                }

                if (temp.task.taskable_id != undefined && temp.task.taskable_id != null) {
                    this.newTask.taskable_id = temp.task.taskable_id.id;
                }
                
                console.log(this.newTask); 
                this.newTask.due_date=new Date(this.newTask.due_date);
            } else {
                this.editFlag = false;
                this.newTask = temp;
                
                this.title = "Edit Task";
                this.botton_tittle='Save';
                if (this.newTask.taskable_type == "App\\Account") {
                    this.AccountContShow();
                    console.log(temp);
                    
                    if(temp.taskable_id.id ==undefined){
                        this.newTask.taskable_id=temp.taskable_id;;
                    }else{
                        this.newTask.taskable_id=temp.taskable_id.id;
                    }
                    //console.log(this.newTask.taskable_id);
                    this.fetch_acc_det(this.newTask.taskable_id); 
                   // setTimeout(()=>{         
                       this.getContact(this.newTask.taskable_id, false);
                     // },300); 
                    
                    console.log(temp);
                    setTimeout(()=>{   
                            if(temp.contact_id && temp.contact_id.id!=undefined){
                                this.newTask.contact_id = temp.contact_id.id;                       
                            }else{
                                this.newTask.contact_id = temp.contact_id;
                            }
                    },1300); 
                } else if(this.newTask.taskable_type == "App\\PersonalAccount"){
                    this.PerAccountContShow();
                    this.per_account_nameSearch=temp.taskable_id.name;
                }else if(this.newTask.taskable_type == "App\\Opportunity"){
                    this.OppContShow();
                    this.opp_nameSearch=temp.taskable_id.name;
                }else{
                    this.AccountCont=false;
                    this.related_to=false;
                }
              console.log(this.newTask.taskable_id,'bbx');
                if (temp.taskable_id != undefined && temp.taskable_id != null) {
                   // if(this.newTask.taskable_id.id!=undefined){
                        this.newTask.taskable_id = temp.taskable_id.id;

                   // }
                   
                }
                console.log(this.newTask.due_date);
               // this.newTask.due_date=this.newTask.due_date.trim();
                this.newTask.due_date=new Date(this.newTask.due_date);
                console.log(this.newTask);    
            }
        }
        else {
            this.title = "Add New Task";
            this.botton_tittle='Add';
            this.editFlag = true;
            this.newTask.taskable_id = undefined;
            this.newTask.taskable_type = "App\\Account"; 
        }
        this.service.setUpAccountsMap().subscribe((data: any) => {
            //this.account = data.accounts;
           // this.paccount = data.personal_accounts;
            this.statusList = data.statuses;
            this.priority = data.priorities;
            this.users = data.users;
        });
    }

    onCloseDialog(flag: any): void {
        this.dialogRef.close(flag);
    }

    popUpMsg: any;

    openDialog(): void {
        //let dialogRef = this.dialog.open(TaskBoxComponent, {
          let dialogRef = this.dialog.open(AlertBoxComponent, {
            width: '250px',
            data: JSON.stringify(this.popUpMsg)
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
        });
    }

    displayOption(obj: any) {
        if (obj.name != undefined) {
            return obj.name;
        } else {
            return (obj.salutation + " " + obj.first_name + " " + obj.middle_name + " " + obj.last_name).split("null").join().replace(",", "").replace(",", "");
        }
    }

    getContact(id: number, flag: boolean) {
        if (flag) {
            this.newTask.contact_id = undefined;
        }
        this.newTask.taskable_id =id; 
        console.log(this.newTask.taskable_id); 
        this.service.getContactFromAccount(this.newTask.taskable_id).subscribe((data: any) => {
       // this.service.getContactFromAccount(id).subscribe((data: any) => {
            this.contacts = data.contacts;
            this.newTask.taskable_id =id;
        });
    }

    ngOnInit() {
    }

    AccountCont: boolean = true;
    PerAccountCont: boolean = false;
    PerOppCont: boolean = false;

    AccountContShow() {
        this.newTask.taskable_type = "App\\Account";
        this.AccountCont = true;
        this.PerAccountCont = false;
        this.PerOppCont = false;
        // this.newTask.taskable_id=undefined;

    }

    PerAccountContShow() {
        this.newTask.taskable_type = "App\\PersonalAccount";
        this.AccountCont = false;
        this.PerAccountCont = true;
        this.PerOppCont = false;
        // this.newTask.taskable_id=undefined;
    }

    OppContShow() {
        this.newTask.taskable_type = "App\\Opportunity";
        this.AccountCont = false;
        this.PerAccountCont = false;
        this.PerOppCont = true; 
    }

    name_error = false;
    acct_error = false;
    cont_error = false;
    per_error = false;
    status_error = false;
    due_error=false;
    opp_error = false;

    createNew() {
        
      // console.log(this.newTask); 
       if (this.newTask.name == undefined && this.newTask.name == undefined) {
            this.name_error = true;
            this.popUpMsg = "Please fill name";
            this.openDialog();
            return;
        }
       if(this.newTask.due_date!=undefined){
        this.newTask.due_date=new Date(this.newTask.due_date);
           var dd = (this.newTask.due_date.getDate() < 10 ? '0' : '') + this.newTask.due_date.getDate();
           var MM = ((this.newTask.due_date.getMonth() + 1) < 10 ? '0' : '') + (this.newTask.due_date.getMonth() + 1);
           var yyyy = this.newTask.due_date.getFullYear();
           var hh = this.newTask.due_date.getHours();
           var min = this.newTask.due_date.getMinutes(); 
           this.newTask.due_date=yyyy+'-'+MM+'-'+dd+' '+hh+':'+min; 
         }else{
            this.due_error = true;
            this.popUpMsg = "Please fill due date";
            this.openDialog();
            return;
         }
        
        if (this.newTask.status == undefined && this.newTask.status == undefined) {
            this.status_error = true;
            this.popUpMsg = "Please select status";
            this.openDialog();
            return;
        }
        if (this.AccountCont && this.newTask.taskable_id == undefined && this.newTask.taskable_id == undefined) {
            this.popUpMsg = "Please select an account and Contact";
            this.acct_error = true;
            this.cont_error = true;
            this.openDialog();
            return;
        }
        // if(!this.AccountCont && this.newTask.personal_account_id==undefined){
        //   this.popUpMsg="Please select a personel account";
        //   this.per_error=true;
        //   this.openDialog();
        //   return;
        // }
        this.name_error = false;
        this.acct_error = false;
        this.cont_error = false;
        this.per_error = false;
        this.status_error = false;

        this.due_error = false;
        if (!this.editFlag) {  
            this.service.updateClient(this.newTask).subscribe((data: any) => {
                this.popUpMsg = data;
                this.openDialog();
                this.date.reset();
                this.onCloseDialog(data);
                this.emitFlag();
            });
        } else {
            this.service.createClient(this.newTask).subscribe((data: any) => {
                this.popUpMsg = data;
                this.openDialog();
                this.date = undefined;
                this.onCloseDialog(data);
                this.emitFlag();
            });
        }
    }

    emitFlag() {
        this.updateGrid.emit(true);
    }
     autoAccList=[];
   autoPerAccList=[];
  account_nameSearch:any;
  per_account_nameSearch:any;
  opp_nameSearch:any;
  search_acc(evnt){
    this.autoAccList=[];
    var val=evnt.target.value;
    
      console.log(val);
      this.opportunitieservice.searh_account(val).subscribe((data:any) => {
       console.log(data);
       if(data && data.accounts){
        this.autoAccList=data.accounts;
       }else{
        this.autoAccList=[];
       }
       

      });
    
  }
   search_per_acc(evnt){
    this.autoPerAccList=[];
    var val=evnt.target.value;
    
      console.log(val);
      this.opportunitieservice.searh_p_account(val).subscribe((data:any) => {
       console.log(data);
       if(data && data.personal_accounts){
        this.autoPerAccList=data.personal_accounts;
       }else{
        this.autoPerAccList=[];
       }
       

      });
    
  }
  autoOppoList=[];
     search_opp(evnt){
    this.autoOppoList=[];
    var val=evnt.target.value;
    
      console.log(val);
      this.opportunitieservice.searh_opportunity(val).subscribe((data:any) => {
       console.log(data);
       if(data && data.opp){
        this.autoOppoList=data.opp;
       }else{
        this.autoOppoList=[];
       }
       

      });
    
  }
  fetch_acc_det(id){
    this.autoPerAccList=[];
     this.opportunitieservice.fetch_acc_det(id).subscribe((data:any) => {
       console.log(data);
       if(data && data.account){
                this.account_nameSearch=data.account.name;       
       }

     });
  }
selectPerAccId(id){
  this.newTask.taskable_id=id;
  this.autoPerAccList=[];
     this.opportunitieservice.fetch_p_det(id).subscribe((data:any) => {
       console.log(data);
       if(data && data.personal_account){
                this.per_account_nameSearch=data.personal_account.first_name+' '+data.personal_account.last_name;       
       }

     });
  }
   selectAccId(val:number){
this.autoAccList=[];
this.fetch_acc_det(val);
this.newTask.taskable_id=val;    
      this.opportunitieservice.fetchContactList(val).subscribe((data:any)=>{
          this.contacts=data.contacts;
      });
  
  }
selectOppId(id){
  this.newTask.taskable_id=id;
  this.autoOppoList=[];
     this.opportunitieservice.fetchOppDetails(id).subscribe((data:any) => {
       console.log(data);
       if(data && data.opp){
                this.opp_nameSearch=data.opp.name;       
       }

     });
  }
}
