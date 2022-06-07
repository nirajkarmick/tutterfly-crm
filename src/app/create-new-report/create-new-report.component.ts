import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-create-new-report',
  templateUrl: './create-new-report.component.html',
  styleUrls: ['./create-new-report.component.css']
})
export class CreateNewReportComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<CreateNewReportComponent>,    @Inject(MAT_DIALOG_DATA) public data: any) { 
    alert(JSON.stringify(data))
  }

  ngOnInit() {
    
  }

}
