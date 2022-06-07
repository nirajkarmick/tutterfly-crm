import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {

	constructor(public dialog: MatDialog) { }
	@Input() addressData: any;

  ngOnInit() {
  }
 fetch_airp(id,f_type,cnt){
       
       
    }

}
