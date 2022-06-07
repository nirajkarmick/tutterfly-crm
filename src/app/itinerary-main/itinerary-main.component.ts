import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params, NavigationStart, NavigationEnd, NavigationError} from '@angular/router';
import {Spinkit} from 'ng-http-loader';

@Component({
    selector: 'app-itinerary-main',
    templateUrl: './itinerary-main.component.html',
    styleUrls: ['./itinerary-main.component.css']
})
export class ItineraryMainComponent implements OnInit {


    users: any;
    activeUrl: any;

    constructor(private router: Router) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (localStorage.getItem('user') !== null) {
                    this.users = localStorage.getItem('user');
                }
            }
            if (event instanceof NavigationEnd) {
                console.log(this.router.url);
                var routes = this.router.url.split(':');
                this.activeUrl = routes[1].split(')')[0];
                console.log(this.activeUrl);
            }
        });
    }

    description_html = '';
    itn_description = '';
    public spinkit = Spinkit;

    ngOnInit() {
    
    $('body').attr('data-layout','{"mode": "light", "width": "fluid", "menuPosition": "fixed", "topbar": {"color": "dark"}}');
$('body').attr('data-layout-mode','horizontal');
    }

}
