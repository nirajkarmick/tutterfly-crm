import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-itinerary-html',
  templateUrl: './itinerary-html.component.html',
  styleUrls: ['./itinerary-html.component.css']
})
export class ItineraryHtmlComponent implements OnInit {

  @Input() html_list:any;
  @Input() s3_html_url:any;
  constructor() { }

  ngOnInit() {
  }

}
