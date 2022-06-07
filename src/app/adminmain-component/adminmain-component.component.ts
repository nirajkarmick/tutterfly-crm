import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params,NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-adminmain-component',
  templateUrl: './adminmain-component.component.html',
  styleUrls: ['./adminmain-component.component.css']
})
export class AdminmainComponentComponent implements OnInit {
users:any;
activeUrl:any;
  constructor(private router:Router) { 
             router.events.subscribe( (event) => {
		            if (event instanceof NavigationStart) { 
		                  if (localStorage.getItem("user") !== null) {  
		                    this.users=localStorage.getItem('user');
		                  }
                }		
                if (event instanceof NavigationEnd) { 
                       console.log(this.router.url);
                       var routes=this.router.url.split(':');   
                        this.activeUrl=routes[1].split(')')[0]; 
                        console.log(this.activeUrl);
                        
                        $('body').removeClass('modal-open');
$('body').css('padding-right',0);
                        $('.modal-backdrop').remove();
                }  

        }); }

  public spinkit = Spinkit;
  ngOnInit() {
    $('body').removeAttr('data-layout-mode');
    $('body').attr('data-layout','{"mode": "light", "width": "fluid", "menuPosition": "fixed", "sidebar": { "color": "light", "size": "default", "showuser": false}, "topbar": {"color": "dark"}, "showRightSidebarOnPageLoad": true}');
  }

}
