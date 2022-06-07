import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-report-main',
  templateUrl: './report-main.component.html',
  styleUrls: ['./report-main.component.css']
})
export class ReportMainComponent implements OnInit {

  constructor(
    private router: Router, 
    private msg: MessageService ,private route: ActivatedRoute) { 
      this.msg.sendMessage("report-main");


          if (localStorage.getItem('modulesArray') != null || localStorage.getItem('modulesArray') != undefined) {
          var modulesArray = JSON.parse(localStorage.getItem('modulesArray'));
          console.log(modulesArray); 
            modulesArray.forEach(module => {
              if(module.custom_reports==true){
               this.show_custom=true;
              } 
            });
          }

    }
show_custom=false;
  ngOnInit() {
  }

}
