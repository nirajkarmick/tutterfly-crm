import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {LoginServiceService} from '../service/login-service.service';

@Component({
    selector: 'app-thankyou',
    templateUrl: './thankyou.component.html',
    styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

    constructor(    private router: Router,private _route: ActivatedRoute,private lservice:LoginServiceService) {
        this.postdata.email = this._route.snapshot.params['email'];        
    }
   
    public postdata:any = {};
    ngOnInit() {
    }

    sucessMsg = '';
    errMsg = '';
    loader=false;
    resend_mail() {
       this.loader=true;
       this.sucessMsg = '';
       this.errMsg = ''; 
       this.lservice.resend(this.postdata).subscribe((data:any) => {
            this.loader=false;
            this.sucessMsg = data.message;
        }, err => {
            this.loader=false;
            this.errMsg = err.error;            
        });

       
        /*alert('Email has been sent successfully');*/
    }
}
