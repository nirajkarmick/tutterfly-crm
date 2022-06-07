import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { interval } from 'rxjs';
@Component({
  selector: 'app-alert-msg',
  templateUrl: './alert-msg.component.html',
  styleUrls: ['./alert-msg.component.css']
})
export class AlertMsgComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<AlertMsgComponent>,    @Inject(MAT_DIALOG_DATA) public data: any) {
      //console.log(this.data);
      this.data=JSON.parse(this.data);
      if(this.data.message!=undefined){
        this.data=this.data.message;
      }else{
        this.data=JSON.stringify(this.data);
      }
      interval(8500).subscribe(() => {
           this.dialogRef.close();
         });
     }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
