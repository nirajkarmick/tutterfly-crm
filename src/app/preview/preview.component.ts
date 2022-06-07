import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog} from '@angular/material';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  constructor() { }
@Input() itineraryData:any; 
@Input() itinerary_days:any; 
@Input() flights:any; 
@Input() s3_url:any; 
company_name="";
company_logo=""; 

@Input() user_itinerary_inclusion:any;  
s3_pdf="https://watcons.blob.core.windows.net/tfclive/";

  ngOnInit() {
    console.log(this.itineraryData);
    this.company_name=localStorage.getItem("company_name");
    this.company_logo=localStorage.getItem("company_logo");
  }
  download_itin(divName){
  	var originalContents = $("body").html();
  	var $print = $("#"+divName)
        .clone()
        .addClass('print')
        .prependTo('body');
         console.log($print.html());
    //window.print() stops JS execution
    $("body").css('background','#fff');
    $("body").html($print.html());
    window.print();

    //Remove div once printed
    $print.remove();
    
    $("body").html(originalContents);  
    $("body").css('background','#f3f3f3');

  // 	 var printContents = document.getElementById(divName).innerHTML;
  //    var originalContents = document.body.innerHTML;
	 // document.body.innerHTML = printContents;
	 // window.print();
	 // document.body.innerHTML = originalContents;
      //event.stopPropagation();
     //$("#cmd").css('display','block');
  }


    close_pre_modal() {
        $('#previewModal').css('display', 'none');
    }

}
