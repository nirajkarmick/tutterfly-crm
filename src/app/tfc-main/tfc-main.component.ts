import { Component, OnInit } from '@angular/core';
import {Router, ParamMap} from '@angular/router';

@Component({
  selector: 'app-tfc-main',
  templateUrl: './tfc-main.component.html',
  styleUrls: ['./tfc-main.component.css']
})
export class TfcMainComponent implements OnInit {

  constructor(private router: Router) { }
  logged_id=false; 
  ngOnInit() {
        if (localStorage.getItem('token') != undefined && localStorage.getItem('token') != null) {
            this.logged_id=true;
        }
       
  }

}
