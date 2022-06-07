import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adminfooter',
  templateUrl: './adminfooter.component.html',
  styleUrls: ['./adminfooter.component.css']
})
export class AdminfooterComponent implements OnInit {

  constructor() { }
  copyrightYear = new Date().getFullYear();
  ngOnInit() {
  }

}
