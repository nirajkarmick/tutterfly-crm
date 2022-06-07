import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { AccountServiceService } from '../service/account-service.service';
import { Router, ParamMap } from '@angular/router';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-account-merge',
  templateUrl: './account-merge.component.html',
  styleUrls: ['./account-merge.component.css']
})
export class AccountMergeComponent implements OnInit {
  accMergeSearch=true;
  keyword='';
  accData=[];
  compareData=[];
  popUpMsg:any;
  markedAcc=[];
  postdata={};
  mergeData=new MergeData();
  firstAcc:any;
  secondAcc:any;
  userName:any;

  constructor(private router: Router, private accountServiceService: AccountServiceService, 
    public dialog: MatDialog,private msg :MessageService) {
       this.userName = localStorage.getItem('user');
       this.msg.sendMessage("acc");
       this.checkPermission();
     }
show_merge=false;
  checkPermission() { 

      if (localStorage.getItem('modulesArray') != null) {
      var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
      console.log(modulesArray); 
        modulesArray.forEach(module => {
          if(module.acc_merge==true){
           this.show_merge=true;
          } 
        });
      }
    if (this.show_merge == false) { 
      this.popUpMsg = JSON.stringify('You are not Authorized to view this page!');
      this.openDialog();
      this.router.navigate(['/maindashboard', { outlets: { bodySection: ['accountIndex'] } }]);

    }
  }
  ngOnInit() {

  }
  ratingShow=false;
  mergeList(){
    console.log(this.markedAcc);
    if(this.markedAcc.length < 2){
       //alert('Please select any two accounts');
       this.popUpMsg=JSON.stringify('Please select any two accounts');
        this.openDialog();
       return;
    }
    if(this.markedAcc.length > 2){
       //alert('Please select any two accounts');
       this.popUpMsg=JSON.stringify('Please select any two accounts');
       this.openDialog();
       return;
    }
    if(this.markedAcc.length == 2){
      this.accMergeSearch=false; 
     //this.postdata.account_id=this.markedAcc;
       //  alert('szz');
    this.accountServiceService.compareAcc(this.markedAcc).subscribe((data: any) => {
      console.log(data);
      this.firstAcc=data.first_account;
      this.secondAcc=data.second_account; 
      this.mergeData.master_record=this.firstAcc.id;
      this.mergeData.account_name=this.firstAcc.name;
      this.mergeData.website=this.firstAcc.website;
      this.mergeData.phone=this.firstAcc.phone;
      this.mergeData.description=this.firstAcc.description;
      this.mergeData.email=this.firstAcc.email;
      //this.mergeData.rating_id=this.firstAcc.rating_id?this.firstAcc.rating_id.id:'';
      if(this.firstAcc.rating_id){
        this.mergeData.rating_id=this.firstAcc.rating_id.id;
        this.ratingShow=true;
      }else{
        this.mergeData.rating_id=0;
      }

      this.mergeData.industry_id=this.firstAcc.industry_id.id;
      this.mergeData.billing_address=this.firstAcc.id;
      this.mergeData.first_account_id=this.firstAcc.id;
      this.mergeData.second_account_id=this.secondAcc.id; 
     // alert('s');
      console.log(this.mergeData);
    });
    }
  }
  merge_accounts(){
    console.log(this.mergeData);

    this.accountServiceService.mergeAcc(this.mergeData).subscribe((data: any) => {
      console.log(data);
       this.popUpMsg=JSON.stringify(data.message);
        this.openDialog();
        this.accMergeSearch=true;
        this.accData=[];
        this.markedAcc=[];
        this.keyword='';
    });
  }
  back_to_search_result(){
    this.accMergeSearch=true;
  }
  searchAcc(){
    if(this.keyword ==''){
       this.popUpMsg=JSON.stringify('Please fill keywords');
        this.openDialog();
      return;
    }
    this.markedAcc=[];
    this.accMergeSearch=true;
    this.accData=[];
    this.accountServiceService.searchMergeAcc(this.keyword).subscribe((data: any) => {
      console.log(data);

      this.accData=data.accounts;
      for(let i=0;i<this.accData.length; i++){
         this.accData[i].checked=false;
      }
    });
  }
  checkMark(id){
    if(this.markedAcc.indexOf(id) > -1){
      return true;
    }else{
      return false;
    }
  }
   mark_acc(event,i){ 
    var value=event.target.value;
    var id=event.target.id;

    if(this.markedAcc.indexOf(value) > -1){
      //delete this.markedAcc[this.markedAcc.indexOf(value)];
      var index = this.markedAcc.indexOf(value);
      if (index !== -1) this.markedAcc.splice(index, 1);
      this.accData[i].checked =false;
    }else{
        this.markedAcc.push(event.target.value);
        this.accData[i].checked =true; 
    }
    if(this.markedAcc.length > 2){
      console.log(this.accData[i].checked);
      this.accData[i].checked =false;  
      console.log(this.accData[i].checked);
      this.popUpMsg=JSON.stringify('You can select only two accounts');  
      this.openDialog();
      //return;
    }
     console.log(this.markedAcc);
   }
   openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: this.popUpMsg
      // data: { name: "this.name", animal: "this.animal" }
    });

    dialogRef.afterClosed().subscribe(result => {
    
    });
  }
 

}
export class MergeData {

  "master_record" : any;          
  "account_name" : any;
  "website" :any;
  "phone" : any;
  "email" : any;
  "description" :any;
  "industry_id" : any;
  "rating_id" : any;
  "billing_address" : any;
  "first_account_id" : any;
  "second_account_id" : any

}
