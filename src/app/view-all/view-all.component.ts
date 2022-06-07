import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router, ParamMap } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.css']
})
export class ViewAllComponent implements OnInit {
  rContact:any;
  opportunities:any;
  stages:any;
  grid_name:any;

  link_name:any;
  new_id:any;
  type:any;
  ref_id:any;
  constructor( private router:Router,
    public dialogRef: MatDialogRef<ViewAllComponent>,    @Inject(MAT_DIALOG_DATA) public data: any) {
     if(data.rContact!=undefined){
        this.rContact=data.rContact;
        this.grid_name=data.grid_name;
        this.new_id=data.new_id;
        this.link_name=data.link_name;
        this.type=data.type;
        this.ref_id=data.ref_id;
      }else if(this.data.opportunities!=undefined){
        this.opportunities=data.opportunities;
        this.grid_name=data.grid_name;
        this.new_id=data.new_id;
        this.link_name=data.link_name;
        this.type=data.type;
        this.ref_id=data.ref_id;
      }else if (data.history!=undefined){
        this.stages=data.history;
      }
     }

  onNoClick(): void {
    this.dialogRef.close();
  }
  open_new(){
    this.dialogRef.close(); 
    if(this.type=='c'){
 this.router.navigate(['/maindashboard' ,{ outlets: { bodySection: [this.grid_name] }}],{queryParams:{ 'open': this.new_id,'type': 'c','acc':this.ref_id}}); 
     
    }else{
       this.router.navigate(['/maindashboard' ,{ outlets: { bodySection: [this.grid_name] }}],{queryParams:{ 'open': this.new_id,'type': this.type}}); 
     
    }
     // this.router.navigate(['/maindashboard',{ outlets: { bodySection: ['fileDetails'] }}],{queryParams:{ 'id': obj.id}});
    
    //[routerLink]="['/maindashboard',{ outlets: { bodySection: [grid_name] }}]"

  }
open_details(idd){
  this.dialogRef.close(); 
      this.router.navigate(['/maindashboard' ,{ outlets: { bodySection: [this.link_name] }}],{queryParams:{ 'id': idd}}); 
     
}
  ngOnInit() {
  }

}
