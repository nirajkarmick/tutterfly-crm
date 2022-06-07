import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-itinerary-pdf',
  templateUrl: './itinerary-pdf.component.html',
  styleUrls: ['./itinerary-pdf.component.css']
})
export class ItineraryPdfComponent implements OnInit {
  @Input() pdf_list:any;
  @Input() s3_pdf:any;
  constructor() { }

  ngOnInit() {
  }

}
