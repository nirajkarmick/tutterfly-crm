import {Component, OnInit} from '@angular/core';
import {AdminServiceService} from '../service/admin-service.service';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
    stats = new Stat();

    constructor(private service: AdminServiceService) {
        this.service.getIndexCall().subscribe((data: any) => {
            this.stats = data;
        });
    }

    ngOnInit() {
    }

}
export class Stat {
    total_destinations: any;
    total_roles: any;
    total_users: any;
}
