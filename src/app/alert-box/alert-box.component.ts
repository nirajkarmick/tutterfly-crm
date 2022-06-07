import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { interval } from 'rxjs';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.css']
})
export class AlertBoxComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AlertBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(this.data);
    this.data = JSON.parse(this.data);
    if (this.data.message != undefined) {
      this.data = this.data.message;
    } else {
      this.data = JSON.stringify(this.data);
    }
    $('.mat-dialog-container').css('padding','5px');
    interval(2500).subscribe(() => {
      this.dialogRef.close(); 
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
