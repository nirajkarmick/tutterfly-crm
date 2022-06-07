import { Component, OnInit, OnDestroy,Injectable } from '@angular/core';
import { Router } from '@angular/router'
//import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription }   from 'rxjs/Subscription';
import { Spinkit } from 'ng-http-loader';
//import { NgcInitializeEvent, NgcStatusChangeEvent,NgcNoCookieLawEvent } from 'ngx-cookieconsent';

import { MatDialog } from '@angular/material';
import { AlertBoxComponent } from './alert-box/alert-box.component';

const MINUTES_UNITL_AUTO_LOGOUT = 30 // in mins
const CHECK_INTERVAL = 30000 // in ms
const STORE_KEY =  'lActive';
@Injectable()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  public spinkit = Spinkit;
  //keep refs to subscriptions to be able to unsubscribe later
  // private popupOpenSubscription: Subscription;
  // private popupCloseSubscription: Subscription;
  // private initializeSubscription: Subscription;
  // private statusChangeSubscription: Subscription;
  // private revokeChoiceSubscription: Subscription;
  // private noCookieLawSubscription: Subscription;
 
  constructor(private router: Router, public dialog: MatDialog,
    //private ccService: NgcCookieConsentService
    ){
   // this.check();
   // localStorage.setItem(STORE_KEY, lastAction.toString());
    this.initListener();
    this.initInterval();
    localStorage.setItem(STORE_KEY,Date.now().toString());

  }
  popUpMsg: any;
  openDialog(): void {
    let dialogRef = this.dialog.open(AlertBoxComponent, {
      width: '250px',
      data: JSON.stringify(this.popUpMsg)
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
   public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }
 public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover',()=> this.reset());
    document.body.addEventListener('mouseout',() => this.reset());
    document.body.addEventListener('keydown',() => this.reset());
    document.body.addEventListener('keyup',() => this.reset());
    document.body.addEventListener('keypress',() => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    console.log('check');
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if (isTimeout)  {
      this.logout(); 
    }
  }


  logout() {   
      this.popUpMsg = 'Session Timeout!';
      this.openDialog();
    localStorage.clear();
    localStorage.setItem("url",location.href);    
                location.href='/';
   // this.router.navigate(['/']);
  }
      ngOnInit() {
    // this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
    //   () => { });
 
    // this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
    //   () => {});
 
    // this.initializeSubscription = this.ccService.initialize$.subscribe(
    //   (event: NgcInitializeEvent) => {});
 
    // this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
    //   (event: NgcStatusChangeEvent) => {});
 
    // this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
    //   () => {});
 
    //   this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
    //   (event: NgcNoCookieLawEvent) => {});
  }
 
  ngOnDestroy() {
    // this.popupOpenSubscription.unsubscribe();
    // this.popupCloseSubscription.unsubscribe();
    // this.initializeSubscription.unsubscribe();
    // this.statusChangeSubscription.unsubscribe();
    // this.revokeChoiceSubscription.unsubscribe();
    // this.noCookieLawSubscription.unsubscribe();
  }
}
